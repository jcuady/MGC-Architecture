-- Finish tiers get a client-facing description for the estimator's
-- finish-selection step (chosen by feel first; rates reveal at the result).
alter table public.finish_rates
  add column if not exists description text not null default '';

update public.finish_rates set description = 'A basic bare home with concrete flooring, unpainted concrete walls, minimal windows, and an exposed ceiling.' where slug = 'bare' and description = '';
update public.finish_rates set description = 'A clean and practical home with tiled flooring, painted walls, standard aluminum-framed windows, and a simple flat ceiling.' where slug = 'standard' and description = '';
update public.finish_rates set description = 'A refined home with large-format tiles or engineered wood flooring, decorative wall cladding, full-height glass windows, and detailed ceilings.' where slug = 'premium' and description = '';
update public.finish_rates set description = 'A luxury home with natural stone or solid wood flooring, imported wall finishes, double-glazed windows, and custom wood or acoustic ceilings.' where slug = 'luxury' and description = '';
