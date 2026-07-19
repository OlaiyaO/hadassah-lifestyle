# Hadassah Lifestyle

Editorial commerce landing page for fashion, footwear, bags and kitchen pieces.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Configure links by copying `.env.example` to `.env.local`.

## Deployment

The app includes `netlify.toml` for Netlify's Next.js runtime. The same production build can run
on EC2 with `npm run build && npm run start`. Product and campaign media is intentionally served
from `public/` so it can later move to S3 or a CDN without changing the component structure.
