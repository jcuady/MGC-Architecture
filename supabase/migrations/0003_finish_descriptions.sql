-- Finish tiers get a client-facing description for the estimator's
-- finish-selection step (chosen by feel first; rates reveal at the result).
alter table public.finish_rates
  add column if not exists description text not null default '';

update public.finish_rates set description = 'Structure complete — walls, roof, and utilities in place, ready for your own finishing touches.' where slug = 'bare' and description = '';
update public.finish_rates set description = 'Move-in ready with dependable standard materials and clean, simple finishes.' where slug = 'standard' and description = '';
update public.finish_rates set description = 'Upgraded materials, custom details, and refined fixtures throughout the home.' where slug = 'premium' and description = '';
update public.finish_rates set description = 'High-end materials, bespoke cabinetry, and designer finishes in every room.' where slug = 'luxury' and description = '';
