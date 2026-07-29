-- Blog posts for /blog and landing Latest Articles.
-- Public reads published rows; authenticated admins full CRUD.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  cover_image text not null default '',
  cover_alt text not null default '',
  read_mins int not null default 3 check (read_mins > 0),
  sort_order int not null default 0,
  is_published boolean not null default true,
  published_at timestamptz not null default now()
);

create index if not exists blog_posts_published_sort_idx
  on public.blog_posts (is_published, sort_order, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "anyone reads published blog posts" on public.blog_posts;
create policy "anyone reads published blog posts"
  on public.blog_posts for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "admin inserts blog posts" on public.blog_posts;
create policy "admin inserts blog posts"
  on public.blog_posts for insert
  to authenticated
  with check (true);

drop policy if exists "admin updates blog posts" on public.blog_posts;
create policy "admin updates blog posts"
  on public.blog_posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes blog posts" on public.blog_posts;
create policy "admin deletes blog posts"
  on public.blog_posts for delete
  to authenticated
  using (true);

-- Seed the four education essays from blog.md
insert into public.blog_posts (
  title, slug, excerpt, body, cover_image, cover_alt, read_mins, sort_order, is_published, published_at
) values
(
  'Before You Build, Read This',
  'before-you-build-read-this',
  'Building or renovating is one of the biggest investments you''ll make — the right Architect, Engineer, and Contractor make all the difference.',
  E'Building or renovating a space is one of the biggest investments you''ll make, so having the right professionals by your side can make all the difference. An Architect, Engineer, and Contractor each play an important role in turning your ideas into a safe, functional, and well-built space.\n\nAn Architect plans and designs your space based on your needs, lifestyle, budget, and local building regulations. An Engineer ensures the structure and building systems are safe and reliable. A Contractor brings the plans to life by managing the construction and coordinating the work on site.\n\nWorking with the right team from the very beginning helps prevent costly mistakes, reduces unnecessary delays, and gives you confidence that your project is built on a strong foundation.',
  '/portfolio/guest-quarter/guest-quarter-view-2.png',
  'Guest quarter interior — coordinated design and documentation',
  3, 10, true, now()
),
(
  'Mistakes to Avoid Before You Build',
  'mistakes-to-avoid-before-you-build',
  'A successful project starts long before construction begins. Avoiding these common mistakes can save you time, money, and unnecessary stress.',
  E'A successful project starts long before construction begins. Avoiding these common mistakes can save you time, money, and unnecessary stress.\n\nMistake #1: Starting without a clear plan\nJumping into construction too soon often leads to design changes, delays, and unexpected expenses.\n\nMistake #2: Underestimating your budget\nSet a realistic budget early so design decisions and material selections align with what you''re comfortable investing.\n\nMistake #3: Skipping the planning stage\nTaking time to plan your spaces, lifestyle needs, and future goals helps create a home or building that works for years to come.\n\nMistake #4: Incomplete property documents\nPreparing important documents ahead of time can help avoid delays during the design and permit process.\n\nMistake #5: Hiring the wrong professionals\nChoosing qualified professionals from the start helps ensure your project is properly planned, coordinated, and executed.\n\nGood planning is one of the best investments you can make before building. The more prepared you are before construction starts, the smoother your project is likely to be.',
  '/portfolio/c-house/c-house-02-living-area-view-2.png',
  'Residential living space — planning before construction',
  4, 20, true, now()
),
(
  'From Idea to Reality',
  'from-idea-to-reality',
  'Every project starts with a conversation. A clear process leads to better decisions, fewer surprises, and thoughtfully designed spaces.',
  E'Every project starts with a conversation. We take the time to understand your goals, ideas, budget, and vision before developing a design that suits your needs.\n\nOnce the direction is finalized, the design is refined, the necessary drawings and documents are prepared, and the project moves toward permits and construction. Throughout the process, you''ll be involved in key decisions to ensure the final design reflects what matters most to you.\n\nA clear process leads to better decisions, fewer surprises, and spaces that are thoughtfully designed from start to finish.',
  '/portfolio/saro/saro-view-2.png',
  'Conceptual architecture study — early project conversation',
  3, 30, true, now()
),
(
  'Budget-Saving Tips Before You Build',
  'budget-saving-tips-before-you-build',
  'Thoughtful planning can help you avoid unnecessary expenses — good planning means spending wisely, not always spending less.',
  E'Building a home or commercial space is a significant investment, and thoughtful planning can help you avoid unnecessary expenses. While every project is different, these simple practices can help keep your project on track and make the most of your budget.\n\nFinalize your design first.\nMaking changes after construction has started often results in additional labor, material costs, and project delays. A well-developed design helps minimize costly revisions.\n\nSet a realistic budget.\nKnowing your budget early allows design decisions and material selections to align with what you''re comfortable investing, reducing the need for major adjustments later.\n\nPlan for the future.\nConsider how your needs may change over time. Designing with flexibility in mind can help reduce the need for future renovations or extensions.\n\nChoose quality over shortcuts.\nInvesting in durable materials and proper workmanship can lead to lower maintenance costs and better long-term value.\n\nWork with the right team.\nClear communication and proper coordination between everyone involved can help prevent misunderstandings, delays, and unnecessary expenses throughout the project.\n\nGood planning doesn''t always mean spending less—it means spending wisely. Making informed decisions early can help your project run more smoothly and make every peso count.',
  '/portfolio/the-hearth/the-hearth-dining-view-2.png',
  'Warm dining interior — finish level and budget',
  4, 40, true, now()
)
on conflict (slug) do nothing;
