-- Align blog seed covers with public/blog assets (idempotent).
update public.blog_posts
set cover_image = '/blog/blog-01-before-you-build.png',
    cover_alt = 'Home office workspace - planning before you build',
    updated_at = now()
where slug = 'before-you-build-read-this';

update public.blog_posts
set cover_image = '/blog/blog-02-mistakes-to-avoid.jpg',
    cover_alt = 'Stair and shelving interior - mistakes to avoid before building',
    updated_at = now()
where slug = 'mistakes-to-avoid-before-you-build';

update public.blog_posts
set cover_image = '/blog/blog-03-from-ideas-to-reality.png',
    cover_alt = 'Wooden pavilion structure - from idea to reality',
    updated_at = now()
where slug = 'from-idea-to-reality';

update public.blog_posts
set cover_image = '/blog/blog-04-budget.jpg',
    cover_alt = 'Dining room with shelving - budget-saving tips before you build',
    updated_at = now()
where slug = 'budget-saving-tips-before-you-build';
