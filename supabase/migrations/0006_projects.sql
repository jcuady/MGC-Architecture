-- Portfolio projects for /work and studio CRUD.
-- Public reads published rows; authenticated admins full CRUD.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  name text not null,
  category text not null default '',
  year text not null default '',
  status text not null default '',
  location text,
  role text not null default '',
  description text not null default '',
  story text not null default '',
  scope text[] not null default '{}',
  hero text not null default '',
  hero_alt text not null default '',
  images jsonb not null default '[]'::jsonb,
  pieces jsonb,
  capstone jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create index if not exists projects_published_sort_idx
  on public.projects (is_published, sort_order);

alter table public.projects enable row level security;

drop policy if exists "anyone reads published projects" on public.projects;
create policy "anyone reads published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "admin inserts projects" on public.projects;
create policy "admin inserts projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "admin updates projects" on public.projects;
create policy "admin updates projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes projects" on public.projects;
create policy "admin deletes projects"
  on public.projects for delete
  to authenticated
  using (true);

insert into public.projects (
  slug, name, category, year, status, location, role, description, story,
  scope, hero, hero_alt, images, pieces, capstone, sort_order, is_published
) values
(
  'c-house',
  'C House',
  'Residential',
  '2025',
  'Design',
  'Meycauayan, Bulacan',
  'Designer under RC LLaguno Construction',
  'A modern two-storey residence transformed from an existing bungalow — planned around family life, future needs, and a warm contemporary palette.',
  'Handled under RC LLaguno Construction, this project was handled by the design team from the first client meetings through schematic design, drawing development, and building-permit assistance. The proposal transforms an existing bungalow into a modern two-storey residence shaped around the family''s changing lifestyle: space for two vehicles, dedicated bedrooms, a home office, and a ground-floor bedroom for an elderly family member. The client''s preferred palette of green, grey, brown, and mustard guides a warm contemporary home that feels open without giving up privacy.',
  array['Architectural Design', 'Construction Drawings', '3D Visualization', 'Permit Assistance']::text[],
  '/portfolio/c-house/c-house-01-exterior-view-1.png',
  'C House — two-storey residence exterior with gabled roof, timber slats, and perimeter fence',
  '[{"src":"/portfolio/c-house/c-house-01-exterior-view-1.png","alt":"C House — main exterior view with gabled roof and timber slats","kind":"render"},{"src":"/portfolio/c-house/c-house-02-exterior-view-2.png","alt":"C House — exterior view from the street corner","kind":"render"},{"src":"/portfolio/c-house/c-house-02-exterior-view-3.png","alt":"C House — exterior view showing the entry and garden buffer","kind":"render"},{"src":"/portfolio/c-house/c-house-02-living-area-view-1.png","alt":"C House — living area with warm timber accents","kind":"render"},{"src":"/portfolio/c-house/c-house-02-living-area-view-2.png","alt":"C House — living area toward the dining space","kind":"render"},{"src":"/portfolio/c-house/c-house-02-living-area-view-3.png","alt":"C House — living area detail with natural light","kind":"render"},{"src":"/portfolio/c-house/c-house-02-dining-area-view-1.png","alt":"C House — dining area connecting living and kitchen","kind":"render"},{"src":"/portfolio/c-house/c-house-02-kitchen-area-view-1.png","alt":"C House — kitchen area with island counter","kind":"render"},{"src":"/portfolio/c-house/c-house-02-kitchen-area-view-2.png","alt":"C House — kitchen area detail","kind":"render"}]'::jsonb,
  null,
  null,
  10,
  true
),
(
  'tile-co',
  'Tile Co. Office & Showroom',
  'Commercial',
  '2025',
  'Design',
  'San Juan City',
  'Designer under RC LLaguno Construction',
  'A larger office with dedicated tile storage and a minimalist showroom — planned so customers can browse products in a clear, welcoming setting.',
  'Managed under RC LLaguno Construction, this commercial project followed the design team from the first consultation through design development, plan preparation, and permit documentation. The proposal supports the client''s expansion by relocating operations into a larger office with dedicated storage for tile inventory. A minimalist showroom is integrated so customers can comfortably browse selections — the product is staged in real settings rather than racks alone.',
  array['Commercial Design', 'Space Planning', '3D Visualization', 'Permit Assistance']::text[],
  '/portfolio/tile-co/tile-co-interior-view-1.png',
  'Tile Co. office and showroom interior with tile displays',
  '[{"src":"/portfolio/tile-co/tile-co-interior-view-1.png","alt":"Tile Co. — showroom entry with staged tile settings","kind":"render"},{"src":"/portfolio/tile-co/tile-co-interior-view-2.png","alt":"Tile Co. — display wall with tile collections","kind":"render"},{"src":"/portfolio/tile-co/tile-co-interior-view-3.png","alt":"Tile Co. — office area sharing showroom finishes","kind":"render"},{"src":"/portfolio/tile-co/tile-co-interior-view-4.png","alt":"Tile Co. — consultation area with sample surfaces","kind":"render"},{"src":"/portfolio/tile-co/tile-co-interior-view-5.png","alt":"Tile Co. — showroom perspective toward the work area","kind":"render"}]'::jsonb,
  null,
  null,
  20,
  true
),
(
  'the-noir',
  'The Noir',
  'Residential',
  '2024',
  'Academic Works',
  null,
  'Independent Designer',
  'A conceptual residential interior exploring modern luxury through darker tones, rich textures, and carefully selected materials.',
  'The Noir is a conceptual residential interior project that explores a refined interpretation of modern luxury through a bedroom and living area. Darker tones, rich textures, and carefully selected materials create a space that feels elegant without being overwhelming. Every design decision balances bold aesthetics with comfort and everyday functionality — timeless interiors that stay sophisticated, simple, and inviting.',
  array['Residential Interior Design', 'Furniture Selection', 'Lighting Design', '3D Visualization']::text[],
  '/portfolio/the-noir/the-noir-living-view-1.png',
  'The Noir — living room with marble feature wall, wood shelving, and warm rust textiles',
  '[{"src":"/portfolio/the-noir/the-noir-living-view-1.png","alt":"The Noir — living room with marble feature wall and rust textiles","kind":"render"},{"src":"/portfolio/the-noir/the-noir-bedroom-view-1.png","alt":"The Noir — bedroom in dark layered tones","kind":"render"},{"src":"/portfolio/the-noir/the-noir-living-view-2.png","alt":"The Noir — living room toward the backlit shelving","kind":"render"},{"src":"/portfolio/the-noir/the-noir-living-view-3.png","alt":"The Noir — reading corner with sculptural chair and artwork","kind":"render"},{"src":"/portfolio/the-noir/the-noir-living-view-4.png","alt":"The Noir — living room detail in stone and walnut","kind":"render"}]'::jsonb,
  null,
  null,
  30,
  true
),
(
  'the-hearth',
  'The Hearth',
  'Residential',
  '2024',
  'Academic Works',
  null,
  'Independent Designer',
  'A conceptual kitchen and dining study — bright, open, and welcoming, with generous storage kept clean and uncluttered.',
  'The Hearth is a conceptual study focused on a minimalist kitchen and dining space that feels bright, open, and welcoming. The layout prioritizes functionality with generous storage while keeping a clean, uncluttered appearance. Natural light and a simple material palette create an airy atmosphere for everyday family living — practical spaces that still feel spacious and comfortable.',
  array['Residential Interior Design', 'Kitchen Design', 'Cabinetry Design', '3D Visualization']::text[],
  '/portfolio/the-hearth/the-hearth-kitchen-view-1.png',
  'The Hearth — kitchen with timber island, pendant lights, and white brick backsplash',
  '[{"src":"/portfolio/the-hearth/the-hearth-kitchen-view-1.png","alt":"The Hearth — kitchen with timber island and pendant lights","kind":"render"},{"src":"/portfolio/the-hearth/the-hearth-dining-view-1.png","alt":"The Hearth — dining room with backlit shelving and rattan cabinetry","kind":"render"},{"src":"/portfolio/the-hearth/the-hearth-kitchen-view-2.png","alt":"The Hearth — kitchen work surface and open shelving","kind":"render"},{"src":"/portfolio/the-hearth/the-hearth-kitchen-view-3.png","alt":"The Hearth — kitchen detail with white brick backsplash","kind":"render"},{"src":"/portfolio/the-hearth/the-hearth-dining-view-2.png","alt":"The Hearth — dining table under the sculptural pendant","kind":"render"},{"src":"/portfolio/the-hearth/the-hearth-dining-view-3.png","alt":"The Hearth — dining room perspective toward the kitchen","kind":"render"}]'::jsonb,
  null,
  null,
  40,
  true
),
(
  'guest-quarter',
  'Guest Quarter',
  'Residential',
  '2026',
  'Design',
  'Sampaloc, Manila',
  'Designer under RC LLaguno Construction',
  'A mid-century-inspired guest floor — bedroom, workspace, coffee nook, and storage planned as a self-contained stay.',
  'Undertaken under RC LLaguno Construction, the designer was responsible for the guest floor. Inspired by mid-century interiors, the layout is a self-contained living space with a bedroom, workspace, coffee nook, built-in shelving, and generous wardrobe storage — a warm, functional environment for extended stays with both comfort and privacy.',
  array['Residential Interior Design', 'Built-In Cabinetry', '3D Visualization']::text[],
  '/portfolio/guest-quarter/guest-quarter-view-1.png',
  'Guest Quarter — compact guest bedroom interior',
  '[{"src":"/portfolio/guest-quarter/guest-quarter-view-1.png","alt":"Guest Quarter — guest bedroom with integrated storage","kind":"render"},{"src":"/portfolio/guest-quarter/guest-quarter-view-4.png","alt":"Guest Quarter — bedroom perspective toward the window","kind":"render"},{"src":"/portfolio/guest-quarter/guest-quarter-view-2.png","alt":"Guest Quarter — desk and vanity nook","kind":"render"},{"src":"/portfolio/guest-quarter/guest-quarter-view-3.png","alt":"Guest Quarter — wardrobe cabinetry fitted to the room width","kind":"render"}]'::jsonb,
  null,
  null,
  50,
  true
),
(
  'capstone',
  'Architectural Capstone',
  'Institutional',
  '2025',
  'Academic Works',
  null,
  'Independent Designer — Collaboration',
  'Longos Central Elementary School reimagined — comfortable, functional classrooms and shared spaces ready for future generations.',
  'Longos Central Elementary School was reimagined as a learning environment that better supports both students and teachers. The proposal focuses on creating classrooms and shared spaces that are more comfortable, functional, and ready to meet the needs of future generations.',
  array['Institutional Design', 'Climate-Responsive Design', 'Design Research', '3D Visualization']::text[],
  '/portfolio/capstone/archi-capstone-exterior-view-1.png',
  'Architectural Capstone — two-storey institutional building with brick facade and timber canopy',
  '[{"src":"/portfolio/capstone/archi-capstone-exterior-view-1.png","alt":"Architectural Capstone — main exterior with brick facade and timber canopy","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-2.png","alt":"Architectural Capstone — approach view along the shaded walkway","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-3.png","alt":"Architectural Capstone — courtyard elevation with screened verandas","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-4.png","alt":"Architectural Capstone — exterior view showing brick mass and shading","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-5.png","alt":"Architectural Capstone — perspective across the landscaped grounds","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-6.png","alt":"Architectural Capstone — evening exterior view","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-interior-view-.png","alt":"Architectural Capstone — interior learning space with natural ventilation","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-interior-view-1.png","alt":"Architectural Capstone — interior common area","kind":"render"},{"src":"/portfolio/capstone/archi-capstone-design-problem.png","alt":"Architectural Capstone — design problem diagram","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-design-approach.png","alt":"Architectural Capstone — design approach diagram","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-design-strategy-1.png","alt":"Architectural Capstone — design strategy diagram, part one","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-design-strategy-2.png","alt":"Architectural Capstone — design strategy diagram, part two","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-floor-plan.png","alt":"Architectural Capstone — floor plan","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-axonometric-view-1.png","alt":"Architectural Capstone — axonometric view","kind":"diagram"},{"src":"/portfolio/capstone/archi-capstone-interior-axonometric-view-2.png","alt":"Architectural Capstone — interior axonometric view","kind":"diagram"}]'::jsonb,
  null,
  '{"grid":[{"src":"/portfolio/capstone/archi-capstone-exterior-view-1.png","alt":"Architectural Capstone — main exterior with brick facade and timber canopy"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-2.png","alt":"Architectural Capstone — approach view along the shaded walkway"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-3.png","alt":"Architectural Capstone — courtyard elevation with screened verandas"},{"src":"/portfolio/capstone/archi-capstone-exterior-view-4.png","alt":"Architectural Capstone — exterior view showing brick mass and shading"}],"problem":{"title":"The Problem","body":"A closer look at the existing campus revealed overcrowded classrooms, poor ventilation, excessive heat, limited daylight, and aging facilities that affect everyday learning. These challenges became the foundation for a design that puts student comfort, well-being, and learning first.","diagram":"/portfolio/capstone/archi-capstone-design-problem.png","diagramAlt":"Architectural Capstone — design problem diagram"},"approach":{"title":"The Approach","body":"With Needs, Design, and Comfort as the guiding principles, every space was planned to be flexible, inclusive, and easy to navigate. The campus layout also strengthens connections between buildings, introduces more green spaces, and incorporates vernacular-inspired elements to give the school a stronger sense of identity.","diagram":"/portfolio/capstone/archi-capstone-design-approach.png","diagramAlt":"Architectural Capstone — design approach diagram"},"classroom":{"src":"/portfolio/capstone/archi-capstone-interior-view-.png","alt":"Architectural Capstone — inside classroom view with natural ventilation"},"strategy":{"title":"Design Strategy","body":"One of the key priorities was improving thermal comfort inside the classrooms. Through solar analysis, the placement and density of sun-shading panels were carefully adjusted based on each building''s orientation, helping reduce heat and glare while bringing in comfortable natural daylight. Selected materials balance durability, comfort, and ease of maintenance — reinforced concrete, fired clay brick, insulated G.I. roofing, acoustic ceilings, vinyl flooring, and fiberglass skylights.","diagrams":[{"src":"/portfolio/capstone/archi-capstone-design-strategy-1.png","alt":"Architectural Capstone — design strategy diagram one"},{"src":"/portfolio/capstone/archi-capstone-design-strategy-2.png","alt":"Architectural Capstone — design strategy diagram two"},{"src":"/portfolio/capstone/archi-capstone-axonometric-view-1.png","alt":"Architectural Capstone — axonometric diagram and material key"}]},"feature":{"src":"/portfolio/capstone/archi-capstone-exterior-view-5.png","alt":"Architectural Capstone — perspective across the landscaped grounds"},"closing":[{"src":"/portfolio/capstone/archi-capstone-exterior-view-6.png","alt":"Architectural Capstone — evening exterior view"},{"src":"/portfolio/capstone/archi-capstone-interior-view-1.png","alt":"Architectural Capstone — interior common area"}]}'::jsonb,
  60,
  true
),
(
  'saro',
  'Saro',
  'Institutional',
  '2023',
  'Academic Works',
  null,
  'Independent Designer',
  'A pavilion inspired by the traditional Tausug salakot — shade, shelter, and Filipino identity in contemporary form.',
  'Saro is a conceptual pavilion inspired by the traditional Tausug salakot, celebrating both its practical purpose and its cultural significance in Filipino heritage. The design reinterprets the familiar form into a contemporary structure that offers shade, shelter, and a welcoming gathering space — a tribute to Filipino identity that blends traditional inspiration with modern design thinking.',
  array['Concept Design', 'Pavilion Design', '3D Visualization']::text[],
  '/portfolio/saro/saro-view-1.png',
  'Saro — pavilion concept perspective view',
  '[{"src":"/portfolio/saro/saro-view-1.png","alt":"Saro — pavilion perspective framing the landscape","kind":"render"},{"src":"/portfolio/saro/saro-view-2.png","alt":"Saro — pavilion view from the gathering space","kind":"render"},{"src":"/portfolio/saro/saro-view-3.png","alt":"Saro — pavilion structure detail","kind":"render"},{"src":"/portfolio/saro/saro-view-4.png","alt":"Saro — pavilion at dusk","kind":"render"}]'::jsonb,
  null,
  null,
  70,
  true
),
(
  'built-in',
  'Built-In Furnitures',
  'Cabinetry & Furniture',
  '2025',
  'Complete Fit-Out',
  null,
  'Designer under RC LLaguno Construction',
  'Custom closets, kitchen cabinets, display shelves, and storage — designed, detailed, sourced, and coordinated through installation.',
  'Completed under RC LLaguno Construction, these custom built-in furniture projects followed design development, detailed shop drawings, material sourcing, and fabrication coordination through installation. Closets, kitchen cabinets, display shelves, feature walls, and tailored storage were drawn to each client''s needs. Close collaboration with fabricators kept every piece accurate while staying functional and visually cohesive.',
  array['Cabinetry Design', 'Technical Drawings', 'Fabrication Coordination', '3D Visualization']::text[],
  '/portfolio/built-in/built-in-proj-01-view.png',
  'Built-in — bedroom vanity table, display shelf, and TV console',
  '[{"src":"/portfolio/built-in/built-in-proj-01-view.png","alt":"Bedroom vanity table, display shelf, and TV console — render","kind":"render"},{"src":"/portfolio/built-in/built-in-proj-01-drawing.png","alt":"Bedroom vanity table, display shelf, and TV console — technical drawing","kind":"drawing"},{"src":"/portfolio/built-in/built-in-proj-02-view.png","alt":"Vinyl display shelf — cabinetry render","kind":"render"},{"src":"/portfolio/built-in/built-in-proj-02-drawing.png","alt":"Vinyl display shelf — technical drawing","kind":"drawing"},{"src":"/portfolio/built-in/built-in-proj-03-view.png","alt":"Altar cabinetry — render","kind":"render"},{"src":"/portfolio/built-in/built-in-proj-03-plan.png","alt":"Altar cabinetry — plan drawing","kind":"drawing"}]'::jsonb,
  '[{"title":"Bedroom vanity table, display shelf, TV console","picture":"/portfolio/built-in/built-in-proj-01-view.png","pictureAlt":"Bedroom vanity table, display shelf, and TV console — render","diagram":"/portfolio/built-in/built-in-proj-01-drawing.png","diagramAlt":"Bedroom vanity table, display shelf, and TV console — technical drawing"},{"title":"Vinyl display shelf","picture":"/portfolio/built-in/built-in-proj-02-view.png","pictureAlt":"Vinyl display shelf — cabinetry render","diagram":"/portfolio/built-in/built-in-proj-02-drawing.png","diagramAlt":"Vinyl display shelf — technical drawing"},{"title":"Altar cabinetry","picture":"/portfolio/built-in/built-in-proj-03-view.png","pictureAlt":"Altar cabinetry — render","diagram":"/portfolio/built-in/built-in-proj-03-plan.png","diagramAlt":"Altar cabinetry — plan drawing"}]'::jsonb,
  null,
  80,
  true
)
on conflict (slug) do nothing;
