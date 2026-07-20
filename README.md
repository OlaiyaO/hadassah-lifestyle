# Hadassah Lifestyle

Editorial commerce landing page for fashion, footwear, bags and kitchen pieces.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Configure links by copying `.env.example` to `.env.local`.

## Product updates

Products are validated and generated from `catalog/products.csv`. Run `npm run products:check`
before publishing. See [PRODUCT-UPDATES.md](./PRODUCT-UPDATES.md) for the current editing process and
the recommended Google Sheets plus managed-image workflow for non-developer updates.

## Brand assets

Production-ready SVG and high-resolution PNG logo variants live in `public/brand/`. The primary
lockup is for light backgrounds, the light lockup is for dark backgrounds, and the symbol-only files
are suitable for social avatars and small-format applications.

## Deployment

The app includes `netlify.toml` for Netlify's Next.js runtime. The same production build can run
on EC2 with `npm run build && npm run start`. Product and campaign media is intentionally served
from `public/` so it can later move to S3 or a CDN without changing the component structure.
