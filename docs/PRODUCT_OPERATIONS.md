# Product catalogue operations

The primary staff workflow uses two private Google Forms. Their append-only response tabs are replayed
into a generated `Products` worksheet, which remains the reviewed publishing boundary. The storefront
never reads Form responses directly: it consumes the strictly validated CSV through
`PRODUCTS_CSV_URL`, and the generated `src/data/products.snapshot.json` is used by the browser and
server-side checkout price validation.

Never enter inventory, customer, order, payment, delivery, contact, or other personal information in
the Forms or catalogue spreadsheet. This workflow is only for public product content.

## One-time setup

1. Create or open the private Google Sheet used only for public product information. If a `Products`
   worksheet already exists, leave its current exact schema and reviewed rows in place for migration.
2. Open **Extensions > Apps Script**, paste
   `integrations/google-forms/CatalogueForm.gs` into the Sheet-bound project, and save.
3. Run `setupCatalogueForms` and approve its Forms, Sheets, and trigger permissions. It creates or
   updates **Add or update product** and **Archive product**, links their response tabs, preserves the
   initial `Products` rows in a hidden one-time baseline, installs the submit trigger, and rebuilds
   `Products`.
4. Open `Catalogue Forms Setup`. It contains each Form's owner edit URL, staff
   published/respondent URL, response sheet name, and status.
5. New Forms are closed by setup. From each owner edit URL, restrict responders to approved staff
   Google accounts or a controlled Workspace group if the account supports it. Verify that anonymous
   or public responses are not allowed, then enable **Accepting responses**. Give staff responder
   URLs only; keep Form edit and spreadsheet access limited to owners.
6. In Google Sheets choose **File > Share > Publish to web**, select only the generated `Products`
   worksheet, and choose **Comma-separated values (.csv)**. Never publish the entire workbook or a
   response, setup, baseline, or log tab.
7. Store that published HTTPS CSV URL in the deployment environment as `PRODUCTS_CSV_URL`.

The script has no storefront/server access, makes no external requests, and carries no credentials or
application secrets. Response history is never deleted. `Import Log` records rejected actions and
rebuild errors.

## Exact published schema

```text
id,sku,category,name,price_ngn,unit,image_path,image_alt,description,variant_note,active,sort_order
```

| Column         | Rule                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------- |
| `id`           | Unique lowercase slug, such as `ife-carryall`. Permanent after creation; never rename it. |
| `sku`          | Unique, non-empty stock code.                                                             |
| `category`     | Customer-facing category name.                                                            |
| `name`         | Customer-facing product name.                                                             |
| `price_ngn`    | Positive NGN decimal with no currency sign or commas, for example `52000` or `52000.50`.  |
| `unit`         | Selling unit, such as `piece`, `pair` or `set`.                                           |
| `image_path`   | Local path under `public/`, such as `/images/product-bag.jpg`. URLs are rejected.         |
| `image_alt`    | Concise description of the image for customers using assistive technology.                |
| `description`  | Product description.                                                                      |
| `variant_note` | What must be confirmed about size, colour or set details.                                 |
| `active`       | Exactly `TRUE` or `FALSE`.                                                                |
| `sort_order`   | Unique integer from `0` to `9999`; lower values display first.                            |

The importer accepts at most 500 product rows and 1 MB. It validates every row, identifier, SKU,
sort position, text length, price, image path, and image file before changing the snapshot. One bad
published row rejects the entire import and leaves the previous snapshot untouched.

## Staff changes

### Add

1. Open the **Add or update product** responder URL and select `Add`.
2. Choose a new permanent `id`. Check `Products` first; an existing or archived ID cannot be reused or
   renamed.
3. Complete every product field, including `active` (`TRUE` or `FALSE`) and a unique `sort_order`, then
   submit.
4. Check `Import Log`. An incomplete or conflicting add is ignored and the prior `Products` output is
   retained.

### Update

1. Open **Add or update product**, select `Update`, and enter the existing permanent `id`.
2. Enter only fields that should change. Blank optional fields retain their last valid values. To
   reactivate an archived product, enter `TRUE` in `active`.
3. Submit and review the generated `Products` row and `Import Log`. Never use Update to rename an ID;
   create a genuinely different product under a new ID instead.

### Archive

1. Open **Archive product** and enter the permanent product `id` plus an internal reason/author note.
2. Submit. The next rebuild sets `active` to `FALSE`; it does not delete the product, baseline, or Form
   response history.

Actions are replayed by response timestamp with a stable response-tab/row tie-break. Invalid actions
are logged and skipped. If the automatic trigger reports a problem, an owner can run
`rebuildPublishedProducts` in Apps Script. Do not edit response rows or the hidden baseline.

## Review, publish, and deploy

1. Review `Products` after every change. Confirm exact headers, copy, price, image path, active state,
   and ordering. Review new `ERROR` rows in `Import Log`.
2. Confirm the published CSV still targets only `Products`. A Form submission rebuilds the worksheet,
   but it does not instantly or directly alter the live site; publishing refresh, validation, sync,
   deployment, and any caches still apply.
3. Ensure each image has separately been added under the matching `public/` path in this project.
   Forms do not upload site images. Supported extensions are AVIF, JPEG/JPG, PNG, and WebP; remote
   URLs, traversal, and missing files are rejected by the importer.
4. Run with the production `PRODUCTS_CSV_URL` configured:

```sh
npm run products:check
npm run products:sync
npm test
npm run lint
npm run format:check
npm run build
```

`products:check` downloads and validates without writing. `products:sync` validates and atomically
replaces the snapshot. Both `npm run dev` and `npm run build` sync before Next.js starts. Netlify uses
`build:netlify`, which also syncs directly without script recursion. Deploy only after review and a
successful check/sync/build.

Without `PRODUCTS_CSV_URL`, sync uses the version-controlled developer fallback at
`catalog/products.csv`. Keep that reviewed fallback current as an operational backup.

## Rollback

1. Submit a correcting Update or Archive action. Because Form history is append-only, do not delete or
   rewrite the mistaken response. For a broader rollback, submit updates that restore the previously
   reviewed values.
2. Review `Products` and `Import Log`.
3. Run `npm run products:check`, then `npm run products:sync`, and redeploy.

For an immediate deployment rollback, restore the prior `PRODUCTS_CSV_URL`/published Sheet state or
temporarily remove `PRODUCTS_CSV_URL` to use the reviewed local fallback, then check, sync, and
redeploy. If validation or download fails during a build, deployment stops and the existing snapshot
is not overwritten. Do not bypass validation.

## Emergency developer fallback

Only when the Forms/Sheets workflow is unavailable, a developer may edit `catalog/products.csv`
directly using the exact schema above, add any image under `public/`, remove or override
`PRODUCTS_CSV_URL` for that deployment, and run `products:check`, `products:sync`, tests, lint, format
check, and build. Commit the reviewed CSV, image, and generated snapshot. Reconcile the same change
through a Form after service is restored so the primary history and `Products` output remain
authoritative.
