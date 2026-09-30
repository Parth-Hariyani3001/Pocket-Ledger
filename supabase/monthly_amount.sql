-- Replace dated contribution targets with one standing monthly amount.
-- Copies the target that covers today, or the latest target if none does.
-- Safe to run once on a database that already has public.position.

alter table public.position
  add column monthly_amount numeric(14, 2);

alter table public.position
  add constraint position_monthly_amount_positive
  check (monthly_amount is null or monthly_amount > 0);

update public.position as holding
set monthly_amount = target.amount
from (
  select distinct on (position_id) position_id, amount
  from public.contribution_target
  where start_date <= current_date
    and end_date >= current_date
  order by position_id, start_date desc
) as target
where holding.id = target.position_id
  and holding.monthly_amount is null;

update public.position as holding
set monthly_amount = target.amount
from (
  select distinct on (position_id) position_id, amount
  from public.contribution_target
  order by position_id, start_date desc
) as target
where holding.id = target.position_id
  and holding.monthly_amount is null;

drop table public.contribution_target;
drop function if exists public.contribution_target_validate();
