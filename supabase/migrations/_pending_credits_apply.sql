-- Paste into Supabase SQL Editor for project nbdfkhzjmkppoohhjelg if CLI/MCP cannot apply.
-- Adds editable project credits (Studio → Projects).

alter table public.projects
  add column if not exists credits jsonb not null default '[]'::jsonb;

update public.projects
set credits = '[
  {
    "name": "RC LLaguno Construction",
    "logo": "/brand/rclc-logo.png",
    "logoAlt": "RC LLaguno Construction",
    "layout": "logo"
  }
]'::jsonb,
  updated_at = now()
where slug in ('c-house', 'tile-co', 'guest-quarter', 'built-in')
  and (credits = '[]'::jsonb or credits is null);

update public.projects
set credits = '[
  {
    "name": "mgc architecture",
    "logo": "/brand/monogram-chestnut.png",
    "logoAlt": "MGC Architecture",
    "layout": "badge"
  }
]'::jsonb,
  updated_at = now()
where slug not in ('c-house', 'tile-co', 'guest-quarter', 'built-in')
  and (credits = '[]'::jsonb or credits is null);
