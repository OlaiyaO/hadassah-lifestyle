# Google Forms catalogue integration

`CatalogueForm.gs` is a Google Apps Script for the product catalogue spreadsheet. It creates a
closed **Add or update product** Form, a closed **Archive product** Form, append-only response tabs,
and a trigger that rebuilds the canonical `Products` worksheet.

## Install

1. Open the private catalogue Google Sheet and choose **Extensions > Apps Script**.
2. Replace the editor contents with `CatalogueForm.gs`, save, and run `setupCatalogueForms`.
3. Approve the requested Forms, Sheets, and trigger permissions. The script does not call the
   storefront, server, or any external service and contains no secrets.
4. Open `Catalogue Forms Setup` in the Sheet. Use its owner edit URLs to restrict each Form to the
   approved staff Google accounts or Workspace group. New Forms are closed by setup so this access
   review happens before submissions are enabled.
5. In each Form's settings, verify the responder restriction, then turn on **Accepting responses**.
   Give staff only the published/respondent URLs from `Catalogue Forms Setup`, not Form edit access.
6. Publish only the generated `Products` worksheet as CSV. Never publish the response, setup,
   baseline, or log sheets.

Running `setupCatalogueForms` again repairs the trigger and managed setup records. Run
`rebuildPublishedProducts` manually after correcting a response issue or to verify the current
deterministic output. Invalid submissions are skipped and explained in `Import Log`; response rows
are never deleted.

See [`docs/PRODUCT_OPERATIONS.md`](../../docs/PRODUCT_OPERATIONS.md) for the staff and release
runbook.
