# Mach Property Investments — website

Next.js (App Router) + TypeScript, plain CSS. Static pages plus one API route for the contact form.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Editing content

| What | File |
| --- | --- |
| Portfolio properties | `data/portfolio.ts` (newest first; put photos in `public/properties/` and set `image`) |
| Hero slides, completed deals, team, FAQ, form options | `data/content.ts` |
| Phone, email, hours, headline figures, nav | `data/site.ts` |

Until photos are supplied, property cards and hero slides show a map: the property's area with a pin at its `lat` / `lng`
(slide 1 shows the UK with London, Essex and Manchester highlighted). Adding an `image` replaces the map with the photo.
All photos get the greyscale treatment automatically.

The base maps in `public/maps/` are generated from ONS/OS boundary data by `npm run maps` (`scripts/build-maps.mjs`);
you only need to re-run it to change the map styling or add a new region. The data licence requires the credit line in the footer.

## Contact form

`POST /api/contact` validates name + email server-side and sends the enquiry with [Resend](https://resend.com) (free tier).
Set these environment variables locally in `.env.local` and in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` — where enquiries go (comma-separate several)
- `CONTACT_FROM_EMAIL` — sender on a domain verified in Resend (`onboarding@resend.dev` works for testing, but only delivers to your own Resend account email)

Without them the form shows a "please call or email us" error instead of silently dropping enquiries.

## Deploy

Hosted on Vercel; pushes to `main` auto-deploy once the GitHub repo is connected.

## Before launch

- Replace placeholder copy, figures, properties, team names, phone and email.
- Supply photos and a higher-resolution logo (current one is 202×118).
- Add a Privacy Policy page, and a cookie notice if analytics are added (UK GDPR).
- Add favicon and Open Graph image.
