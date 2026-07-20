# Updating Hadassah Products

## Current workflow

The storefront catalogue is generated from `catalog/products.csv`. Each row controls one product:

- `name`, `category`, `price_ngn`, `unit`, description and variant note control the customer copy.
- `image_path` points to an image in `public/images/`.
- `active` set to `TRUE` publishes a product; `FALSE` removes it at the next build.
- `sort_order` controls display order.

After editing the CSV or replacing product images, run:

```bash
npm run products:sync
npm test
npm run build
```

The sync rejects duplicate IDs, invalid prices, missing images and unsafe paths before a broken
catalogue can be published.

## Owner-friendly publishing recommendation

Before launch, move catalogue editing to a protected Google Sheet using the same columns. Set its
published CSV URL as `PRODUCTS_CSV_URL`, then connect a Netlify build hook so an approved sheet
change triggers a fresh deployment.

Product photography still needs managed storage. Use Cloudinary (or an equivalent image library)
and add a small authenticated upload workflow rather than giving the owner repository access. This
requires extending the current local-image validation before remote image URLs are accepted.

Recommended operating flow:

1. Owner uploads and crops the product image in the managed image library.
2. Owner adds or edits the row in the protected product sheet.
3. Owner marks `active` as `TRUE` only when price, copy and availability are approved.
4. An automated validation build runs and publishes only if every row is valid.
5. An administrator can set `active` to `FALSE` to hide an unavailable product without deleting its
   history.

Do not expose an unauthenticated product editor or accept arbitrary image URLs. Product updates
affect pricing and customer orders and should remain validated and auditable.
