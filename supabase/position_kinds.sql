-- Add PF, crypto, stocks, bonds, and pension to an existing position_kind enum.
-- Safe to run more than once. ADD VALUE cannot run inside a transaction on older Postgres.

alter type public.position_kind add value if not exists 'pf';
alter type public.position_kind add value if not exists 'crypto';
alter type public.position_kind add value if not exists 'stocks';
alter type public.position_kind add value if not exists 'bonds';
alter type public.position_kind add value if not exists 'pension';
