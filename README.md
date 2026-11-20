This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Works content

Works are stored as Markdown files in `content/works/`. The filename becomes the article slug, and the same file supplies the Works catalogue, featured works, and article page. To add a work, create a lowercase slug file such as `content/works/a-new-essay.md`:

```md
---
title: A New Essay
category: ESSAYS
archiveId: SAD-ESS-024
excerpt: A short description for the catalogue.
date: November 2026
readingTime: 6 min read
---
The article body, written in Markdown.
```

Supported categories are `ESSAYS`, `PHILOSOPHY`, `FRAGMENTS`, `POETRY`, and `NOTES`. `subtitle`, `featured`, `featuredOrder`, `featuredExcerpt`, `related`, and `relatedExcerpt` are optional. `archiveId` values must be unique. Existing archive IDs can provide `legacyArchiveId` when an identifier changes so saved reader actions remain available.

## Progressive Web App

SADWRITA can be installed from supported mobile and desktop browsers. Serve the production site over HTTPS; on iPhone or iPad, use Safari's Share menu and choose **Add to Home Screen**. Android and desktop browsers provide their native install option when available.

The service worker is enabled in production to avoid stale caches during development. It pre-caches the homepage, Works, Reader's Space, and Raven app icons, then caches visited pages, writings, and static assets for offline reopening. The browser stores Reader's Card and theme preferences locally as before.

## Reader Card storage

Reader Card requests are stored in Supabase. Run `supabase/migrations/20261120141100_create_reader_card_requests.sql` in the Supabase SQL Editor, then configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `.env.example` in the server environment. Keep the service-role key server-only and never use a `NEXT_PUBLIC_` prefix. To review issued cards, open the `reader_card_requests` table in the Supabase dashboard; row-level security prevents public reads.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
