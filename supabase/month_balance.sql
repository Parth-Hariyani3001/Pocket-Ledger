-- Monthly net-worth changes for months that have already closed.
-- Safe to run once on a database that already has the ledger tables.
-- The current month is never stored. A past month is rewritten only when a
-- transaction or debt in that month changes.

create table if not exists public.month_balance (
  user_id uuid not null references auth.users (id) on delete cascade,
  month date not null,
  cash_delta numeric(14, 2) not null,
  position_delta numeric(14, 2) not null,
  lent_delta numeric(14, 2) not null,
  borrowed_delta numeric(14, 2) not null,
  net_worth_delta numeric(14, 2) generated always as (
    cash_delta + position_delta + lent_delta - borrowed_delta
  ) stored,
  primary key (user_id, month),
  constraint month_balance_month_start check (extract(day from month) = 1)
);

create table if not exists public.month_balance_dirty (
  user_id uuid not null references auth.users (id) on delete cascade,
  month date not null,
  primary key (user_id, month),
  constraint month_balance_dirty_month_start check (extract(day from month) = 1)
);

create or replace function public.transaction_mark_month_dirty()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if old.transaction_date is distinct from new.transaction_date
      or old.amount is distinct from new.amount
      or old.direction is distinct from new.direction
      or old.category_id is distinct from new.category_id
      or old.debt_id is distinct from new.debt_id
      or old.position_id is distinct from new.position_id
    then
      insert into public.month_balance_dirty (user_id, month)
      values
        (old.user_id, (date_trunc('month', old.transaction_date))::date),
        (new.user_id, (date_trunc('month', new.transaction_date))::date)
      on conflict do nothing;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    insert into public.month_balance_dirty (user_id, month)
    values (old.user_id, (date_trunc('month', old.transaction_date))::date)
    on conflict do nothing;
    return old;
  end if;

  insert into public.month_balance_dirty (user_id, month)
  values (new.user_id, (date_trunc('month', new.transaction_date))::date)
  on conflict do nothing;
  return new;
end;
$$;

create or replace function public.debt_mark_month_dirty()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if old.principal is distinct from new.principal
      or old.debt_type is distinct from new.debt_type
      or old.start_date is distinct from new.start_date
    then
      insert into public.month_balance_dirty (user_id, month)
      values
        (old.user_id, (date_trunc('month', old.start_date))::date),
        (new.user_id, (date_trunc('month', new.start_date))::date)
      on conflict do nothing;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    insert into public.month_balance_dirty (user_id, month)
    values (old.user_id, (date_trunc('month', old.start_date))::date)
    on conflict do nothing;
    return old;
  end if;

  insert into public.month_balance_dirty (user_id, month)
  values (new.user_id, (date_trunc('month', new.start_date))::date)
  on conflict do nothing;
  return new;
end;
$$;

create or replace function public.refresh_month_balances()
returns void
language plpgsql
set search_path = public
as $$
declare
  uid uuid := (select auth.uid());
  current_month date := (date_trunc('month', current_date))::date;
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;

  insert into public.month_balance_dirty (user_id, month)
  select uid, activity.month
  from (
    select (date_trunc('month', transaction_date))::date as month
    from public.transaction
    where user_id = uid
      and transaction_date < current_month
    union
    select (date_trunc('month', start_date))::date
    from public.debt
    where user_id = uid
      and start_date < current_month
  ) as activity
  where not exists (
    select 1
    from public.month_balance as stored
    where stored.user_id = uid
      and stored.month = activity.month
  )
  on conflict do nothing;

  insert into public.month_balance (
    user_id,
    month,
    cash_delta,
    position_delta,
    lent_delta,
    borrowed_delta
  )
  select
    uid,
    dirty.month,
    coalesce(cash.cash_delta, 0),
    coalesce(cash.position_delta, 0),
    coalesce(lent_principal.amount, 0) + coalesce(debt_lines.lent_delta, 0),
    coalesce(borrowed_principal.amount, 0) + coalesce(debt_lines.borrowed_delta, 0)
  from public.month_balance_dirty as dirty
  left join (
    select
      (date_trunc('month', transaction_date))::date as month,
      coalesce(sum(
        case when direction = 'inflow' then amount else -amount end
      ), 0) as cash_delta,
      coalesce(sum(
        case
          when position_id is not null and direction = 'outflow' then amount
          when position_id is not null and direction = 'inflow' then -amount
          else 0
        end
      ), 0) as position_delta
    from public.transaction
    where user_id = uid
      and (date_trunc('month', transaction_date))::date in (
        select pending.month
        from public.month_balance_dirty as pending
        where pending.user_id = uid
          and pending.month < current_month
      )
    group by 1
  ) as cash on cash.month = dirty.month
  left join (
    select
      (date_trunc('month', start_date))::date as month,
      coalesce(sum(principal), 0) as amount
    from public.debt
    where user_id = uid
      and debt_type = 'borrowed'
      and (date_trunc('month', start_date))::date in (
        select pending.month
        from public.month_balance_dirty as pending
        where pending.user_id = uid
          and pending.month < current_month
      )
    group by 1
  ) as borrowed_principal on borrowed_principal.month = dirty.month
  left join (
    select
      (date_trunc('month', start_date))::date as month,
      coalesce(sum(principal), 0) as amount
    from public.debt
    where user_id = uid
      and debt_type = 'lent'
      and (date_trunc('month', start_date))::date in (
        select pending.month
        from public.month_balance_dirty as pending
        where pending.user_id = uid
          and pending.month < current_month
      )
    group by 1
  ) as lent_principal on lent_principal.month = dirty.month
  left join (
    select
      (date_trunc('month', movement.transaction_date))::date as month,
      coalesce(sum(
        case
          when holding.debt_type = 'borrowed' and movement.direction = 'inflow' then movement.amount
          when holding.debt_type = 'borrowed' and movement.direction = 'outflow' then -movement.amount
          else 0
        end
      ), 0) as borrowed_delta,
      coalesce(sum(
        case
          when holding.debt_type = 'lent' and movement.direction = 'outflow' then movement.amount
          when holding.debt_type = 'lent' and movement.direction = 'inflow' then -movement.amount
          else 0
        end
      ), 0) as lent_delta
    from public.transaction as movement
    join public.debt as holding on holding.id = movement.debt_id
    where movement.user_id = uid
      and movement.debt_id is not null
      and (date_trunc('month', movement.transaction_date))::date in (
        select pending.month
        from public.month_balance_dirty as pending
        where pending.user_id = uid
          and pending.month < current_month
      )
    group by 1
  ) as debt_lines on debt_lines.month = dirty.month
  where dirty.user_id = uid
    and dirty.month < current_month
    and (
      exists (
        select 1
        from public.transaction as line
        where line.user_id = uid
          and (date_trunc('month', line.transaction_date))::date = dirty.month
      )
      or exists (
        select 1
        from public.debt as opening
        where opening.user_id = uid
          and (date_trunc('month', opening.start_date))::date = dirty.month
      )
    )
  on conflict (user_id, month) do update
  set
    cash_delta = excluded.cash_delta,
    position_delta = excluded.position_delta,
    lent_delta = excluded.lent_delta,
    borrowed_delta = excluded.borrowed_delta;

  delete from public.month_balance as stored
  where stored.user_id = uid
    and stored.month in (
      select dirty.month
      from public.month_balance_dirty as dirty
      where dirty.user_id = uid
        and dirty.month < current_month
    )
    and not exists (
      select 1
      from public.transaction as line
      where line.user_id = uid
        and (date_trunc('month', line.transaction_date))::date = stored.month
    )
    and not exists (
      select 1
      from public.debt as opening
      where opening.user_id = uid
        and (date_trunc('month', opening.start_date))::date = stored.month
    );

  delete from public.month_balance_dirty
  where user_id = uid
    and month < current_month;
end;
$$;

drop trigger if exists transaction_mark_month_dirty on public.transaction;
create trigger transaction_mark_month_dirty
  after insert or update or delete on public.transaction
  for each row execute function public.transaction_mark_month_dirty();

drop trigger if exists debt_mark_month_dirty on public.debt;
create trigger debt_mark_month_dirty
  after insert or update or delete on public.debt
  for each row execute function public.debt_mark_month_dirty();

alter table public.month_balance enable row level security;
alter table public.month_balance_dirty enable row level security;
alter table public.month_balance force row level security;
alter table public.month_balance_dirty force row level security;

drop policy if exists "month_balance_select_own" on public.month_balance;
create policy "month_balance_select_own"
  on public.month_balance
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "month_balance_insert_own" on public.month_balance;
create policy "month_balance_insert_own"
  on public.month_balance
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "month_balance_update_own" on public.month_balance;
create policy "month_balance_update_own"
  on public.month_balance
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "month_balance_delete_own" on public.month_balance;
create policy "month_balance_delete_own"
  on public.month_balance
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "month_balance_dirty_select_own" on public.month_balance_dirty;
create policy "month_balance_dirty_select_own"
  on public.month_balance_dirty
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "month_balance_dirty_insert_own" on public.month_balance_dirty;
create policy "month_balance_dirty_insert_own"
  on public.month_balance_dirty
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "month_balance_dirty_update_own" on public.month_balance_dirty;
create policy "month_balance_dirty_update_own"
  on public.month_balance_dirty
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "month_balance_dirty_delete_own" on public.month_balance_dirty;
create policy "month_balance_dirty_delete_own"
  on public.month_balance_dirty
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on function public.transaction_mark_month_dirty() from public, anon;
revoke all on function public.debt_mark_month_dirty() from public, anon;
revoke all on function public.refresh_month_balances() from public, anon;

grant execute on function public.transaction_mark_month_dirty() to authenticated;
grant execute on function public.debt_mark_month_dirty() to authenticated;
grant execute on function public.refresh_month_balances() to authenticated;

revoke all on table public.month_balance from public, anon;
revoke all on table public.month_balance_dirty from public, anon;

grant select, insert, update, delete on table public.month_balance to authenticated;
grant select, insert, update, delete on table public.month_balance_dirty to authenticated;

grant all on table public.month_balance to service_role;
grant all on table public.month_balance_dirty to service_role;
