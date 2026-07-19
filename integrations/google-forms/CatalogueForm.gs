/**
 * Hadassah Lifestyle catalogue Forms workflow.
 * Paste this file into an Apps Script project bound to the catalogue spreadsheet.
 */

const CATALOGUE = Object.freeze({
  productsSheet: 'Products',
  baselineSheet: 'Catalogue Baseline (do not edit)',
  setupSheet: 'Catalogue Forms Setup',
  logSheet: 'Import Log',
  addFormTitle: 'Add or update product',
  archiveFormTitle: 'Archive product',
  addFormProperty: 'CATALOGUE_ADD_FORM_ID',
  archiveFormProperty: 'CATALOGUE_ARCHIVE_FORM_ID',
  addSheetProperty: 'CATALOGUE_ADD_RESPONSE_SHEET_ID',
  archiveSheetProperty: 'CATALOGUE_ARCHIVE_RESPONSE_SHEET_ID',
  schemaProperty: 'CATALOGUE_FORM_SCHEMA_VERSION',
  schemaVersion: '1',
  maxRows: 500,
  headers: [
    'id',
    'sku',
    'category',
    'name',
    'price_ngn',
    'unit',
    'image_path',
    'image_alt',
    'description',
    'variant_note',
    'active',
    'sort_order',
  ],
});

const CATALOGUE_FIELD_HELP = Object.freeze({
  sku: 'Unique stock code, 1-64 characters.',
  category: 'Customer-facing category, 2-60 characters.',
  name: 'Customer-facing name, 2-120 characters.',
  price_ngn: 'Positive NGN amount without a currency sign or commas, for example 52000.50.',
  unit: 'Selling unit, 1-30 characters, for example piece, pair or set.',
  image_path: 'Existing public/ path such as /images/product-bag.jpg. Do not enter a URL.',
  image_alt: 'Accessible image description, 5-180 characters.',
  description: 'Customer-facing product description, 10-500 characters.',
  variant_note: 'Size, colour or set confirmation note, 5-300 characters.',
  active: 'Enter exactly TRUE or FALSE.',
  sort_order: 'Unique integer from 0 to 9999; lower values display first.',
});

/** Creates or updates the two Forms, response destinations, trigger and setup record. */
function setupCatalogueForms() {
  return withCatalogueLock_(function () {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const properties = PropertiesService.getDocumentProperties();
      ensureImportLog_(spreadsheet);
      ensureBaseline_(spreadsheet);

      const addResult = getOrCreateForm_(
        properties,
        CATALOGUE.addFormProperty,
        CATALOGUE.addFormTitle,
      );
      const archiveResult = getOrCreateForm_(
        properties,
        CATALOGUE.archiveFormProperty,
        CATALOGUE.archiveFormTitle,
      );
      const schemaChanged = properties.getProperty(CATALOGUE.schemaProperty) !== CATALOGUE.schemaVersion;

      configureAddForm_(addResult.form, addResult.created || schemaChanged);
      configureArchiveForm_(archiveResult.form, archiveResult.created || schemaChanged);
      linkForm_(addResult.form, spreadsheet);
      linkForm_(archiveResult.form, spreadsheet);

      const addSheet = waitForResponseSheet_(spreadsheet, addResult.form);
      const archiveSheet = waitForResponseSheet_(spreadsheet, archiveResult.form);
      properties.setProperties({
        [CATALOGUE.addSheetProperty]: String(addSheet.getSheetId()),
        [CATALOGUE.archiveSheetProperty]: String(archiveSheet.getSheetId()),
        [CATALOGUE.schemaProperty]: CATALOGUE.schemaVersion,
      });

      installSubmitTrigger_(spreadsheet);
      writeSetupSheet_(spreadsheet, addResult.form, addSheet, archiveResult.form, archiveSheet);
      rebuildPublishedProductsUnlocked_(spreadsheet, addSheet, archiveSheet);
      log_(spreadsheet, 'INFO', 'setup', '', '', 'Catalogue Forms setup completed.');
    } catch (error) {
      log_(SpreadsheetApp.getActiveSpreadsheet(), 'ERROR', 'setup', '', '', error.message);
      throw error;
    }
  });
}

/** Installable spreadsheet form-submit trigger created by setupCatalogueForms(). */
function onFormSubmit(e) {
  rebuildPublishedProducts();
}

/** Replays the baseline and append-only Form responses into the canonical Products sheet. */
function rebuildPublishedProducts() {
  return withCatalogueLock_(function () {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    try {
      const properties = PropertiesService.getDocumentProperties();
      const addSheet = getSheetByStoredId_(spreadsheet, properties.getProperty(CATALOGUE.addSheetProperty));
      const archiveSheet = getSheetByStoredId_(
        spreadsheet,
        properties.getProperty(CATALOGUE.archiveSheetProperty),
      );
      if (!addSheet || !archiveSheet) {
        throw new Error('Form response tabs are not configured. Run setupCatalogueForms() first.');
      }
      rebuildPublishedProductsUnlocked_(spreadsheet, addSheet, archiveSheet);
    } catch (error) {
      log_(spreadsheet, 'ERROR', 'rebuild', '', '', error.message);
      throw error;
    }
  });
}

function rebuildPublishedProductsUnlocked_(spreadsheet, addSheet, archiveSheet) {
  let products = readBaseline_(spreadsheet);
  validateCatalogue_(products);

  const actions = readActions_(addSheet, 'product').concat(readActions_(archiveSheet, 'archive'));
  actions.sort(function (left, right) {
    return (
      left.timestamp - right.timestamp ||
      left.sheetId - right.sheetId ||
      left.rowNumber - right.rowNumber
    );
  });

  let rejected = 0;
  actions.forEach(function (action) {
    try {
      const candidate = new Map(products);
      applyAction_(candidate, action);
      validateCatalogue_(candidate);
      products = candidate;
    } catch (error) {
      rejected += 1;
      log_(
        spreadsheet,
        'ERROR',
        action.source,
        action.rowNumber,
        action.values.id || '',
        error.message,
      );
    }
  });

  validateCatalogue_(products);
  writeProducts_(spreadsheet, products);
  log_(
    spreadsheet,
    'INFO',
    'rebuild',
    '',
    '',
    'Wrote ' + products.size + ' products; skipped ' + rejected + ' invalid actions.',
  );
}

function getOrCreateForm_(properties, propertyName, title) {
  const existingId = properties.getProperty(propertyName);
  if (existingId) {
    try {
      return { form: FormApp.openById(existingId), created: false };
    } catch (error) {
      // A deleted or inaccessible managed Form is replaced without touching old response tabs.
    }
  }

  const form = FormApp.create(title);
  form.setAcceptingResponses(false);
  properties.setProperty(propertyName, form.getId());
  return { form: form, created: true };
}

function configureAddForm_(form, replaceItems) {
  form
    .setTitle(CATALOGUE.addFormTitle)
    .setDescription(
      'Staff catalogue data only. Never enter customer, order, payment, delivery or inventory data. ' +
        'Choose Add for a new permanent id or Update for an existing id. Blank update fields retain their current values.',
    )
    .setConfirmationMessage('Response recorded. Review the Products and Import Log sheets before publishing.');
  secureNewForm_(form);
  if (!replaceItems) return;

  deleteFormItems_(form);
  form.addMultipleChoiceItem().setTitle('Action').setChoiceValues(['Add', 'Update']).setRequired(true);
  form
    .addTextItem()
    .setTitle('id')
    .setHelpText('Required permanent lowercase slug, for example ife-carryall. Never rename or repurpose an id.')
    .setValidation(textPattern_('^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Use a lowercase hyphenated slug.'))
    .setRequired(true);

  CATALOGUE.headers.slice(1).forEach(function (field) {
    const item = field === 'description' || field === 'variant_note' ? form.addParagraphTextItem() : form.addTextItem();
    item.setTitle(field).setHelpText(CATALOGUE_FIELD_HELP[field] + ' Required when Action is Add.');
    const validation = validationForField_(field);
    if (validation) item.setValidation(validation);
  });
}

function configureArchiveForm_(form, replaceItems) {
  form
    .setTitle(CATALOGUE.archiveFormTitle)
    .setDescription(
      'Sets an existing product active field to FALSE. The product and action history are retained. ' +
        'Never enter customer, order, payment, delivery or inventory data.',
    )
    .setConfirmationMessage('Archive request recorded. Review the Products and Import Log sheets before publishing.');
  secureNewForm_(form);
  if (!replaceItems) return;

  deleteFormItems_(form);
  form
    .addTextItem()
    .setTitle('id')
    .setHelpText('Permanent product id. Archiving never renames or deletes it.')
    .setValidation(textPattern_('^[a-z0-9]+(?:-[a-z0-9]+)*$', 'Use the existing lowercase product id.'))
    .setRequired(true);
  form
    .addParagraphTextItem()
    .setTitle('reason_author_notes')
    .setHelpText('Internal reason and staff author note. Do not include customer or order information.')
    .setRequired(true);
}

function secureNewForm_(form) {
  form.setCollectEmail(false).setPublishingSummary(false).setShowLinkToRespondAgain(true);
  try {
    form.setRequireLogin(true);
  } catch (error) {
    // Some consumer accounts do not expose this Workspace control; new Forms remain closed.
  }
}

function deleteFormItems_(form) {
  for (let index = form.getItems().length - 1; index >= 0; index -= 1) form.deleteItem(index);
}

function textPattern_(pattern, helpText) {
  return FormApp.createTextValidation().requireTextMatchesPattern(pattern).setHelpText(helpText).build();
}

function validationForField_(field) {
  const patterns = {
    price_ngn: ['^(?:0|[1-9]\\d{0,9})(?:\\.\\d{1,2})?$', 'Enter a positive decimal without commas.'],
    image_path: [
      '^\\/(?!.*(?:\\.\\.|//))[A-Za-z0-9._/-]+\\.(?:avif|jpe?g|png|webp)$',
      'Enter a safe local image path, not a URL.',
    ],
    active: ['^(?:TRUE|FALSE)$', 'Enter exactly TRUE or FALSE.'],
    sort_order: ['^(?:0|[1-9]\\d{0,3})$', 'Enter an integer from 0 to 9999.'],
  };
  return patterns[field] ? textPattern_(patterns[field][0], patterns[field][1]) : null;
}

function linkForm_(form, spreadsheet) {
  if (form.getDestinationId() !== spreadsheet.getId()) {
    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  }
}

function waitForResponseSheet_(spreadsheet, form) {
  const publishedUrl = form.getPublishedUrl().split('?')[0];
  const editUrl = form.getEditUrl().split('?')[0];
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const sheet = spreadsheet.getSheets().find(function (candidate) {
      const url = candidate.getFormUrl();
      if (!url) return false;
      const normalizedUrl = url.split('?')[0];
      return (
        normalizedUrl === publishedUrl ||
        normalizedUrl === editUrl ||
        normalizedUrl.indexOf(form.getId()) !== -1
      );
    });
    if (sheet) return sheet;
    Utilities.sleep(500);
  }
  throw new Error('Could not locate the response sheet for ' + form.getTitle() + '.');
}

function installSubmitTrigger_(spreadsheet) {
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) {
      return trigger.getHandlerFunction() === 'onFormSubmit';
    })
    .forEach(function (trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(spreadsheet).onFormSubmit().create();
}

function ensureBaseline_(spreadsheet) {
  if (spreadsheet.getSheetByName(CATALOGUE.baselineSheet)) return;
  const productsSheet = spreadsheet.getSheetByName(CATALOGUE.productsSheet);
  const baseline = spreadsheet.insertSheet(CATALOGUE.baselineSheet);
  let rows = [CATALOGUE.headers];

  if (productsSheet && productsSheet.getLastRow() > 0) {
    const values = productsSheet.getDataRange().getDisplayValues();
    assertHeaders_(values[0], CATALOGUE.productsSheet);
    rows = [CATALOGUE.headers].concat(values.slice(1).filter(function (row) {
      return row.some(function (value) {
        return String(value).trim() !== '';
      });
    }));
  }

  baseline.getRange(1, 1, rows.length, CATALOGUE.headers.length).setNumberFormat('@').setValues(rows);
  baseline.setFrozenRows(1);
  baseline.hideSheet();
  baseline.protect().setDescription('One-time migration baseline; do not edit.').setWarningOnly(true);
}

function readBaseline_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(CATALOGUE.baselineSheet);
  if (!sheet) throw new Error('Catalogue baseline is missing. Run setupCatalogueForms() first.');
  const values = sheet.getDataRange().getDisplayValues();
  assertHeaders_(values[0], CATALOGUE.baselineSheet);
  const products = new Map();

  values.slice(1).forEach(function (row, index) {
    if (!row.some(function (value) { return String(value).trim() !== ''; })) return;
    const product = rowToObject_(row);
    if (products.has(product.id)) throw new Error('Baseline row ' + (index + 2) + ': duplicate id ' + product.id + '.');
    products.set(product.id, product);
  });
  return products;
}

function readActions_(sheet, type) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  const indexes = {};
  headers.forEach(function (header, index) {
    if (!indexes[header]) indexes[header] = [];
    indexes[header].push(index);
  });

  return values.slice(1).map(function (row, index) {
    const fields = type === 'product' ? ['Action'].concat(CATALOGUE.headers) : ['id', 'reason_author_notes'];
    const actionValues = {};
    fields.forEach(function (field) {
      actionValues[field] = responseValue_(row, indexes[field] || []);
    });
    const timestamp = row[0] instanceof Date ? row[0].getTime() : new Date(row[0]).getTime();
    return {
      type: type,
      timestamp: Number.isFinite(timestamp) ? timestamp : 0,
      sheetId: sheet.getSheetId(),
      rowNumber: index + 2,
      source: sheet.getName(),
      values: actionValues,
    };
  });
}

function responseValue_(row, indexes) {
  for (let index = indexes.length - 1; index >= 0; index -= 1) {
    const value = String(row[indexes[index]] == null ? '' : row[indexes[index]]).trim();
    if (value !== '') return value;
  }
  return '';
}

function applyAction_(products, action) {
  if (!action.timestamp) throw new Error('Response has an invalid timestamp.');
  const id = action.values.id;
  validateId_(id);
  const previous = products.get(id);

  if (action.type === 'archive') {
    if (!previous) throw new Error('Cannot archive unknown product id ' + id + '.');
    if (!action.values.reason_author_notes || action.values.reason_author_notes.length > 500) {
      throw new Error('Archive reason/author notes must contain 1-500 characters.');
    }
    products.set(id, Object.assign({}, previous, { active: 'FALSE' }));
    return;
  }

  const mode = action.values.Action;
  if (mode === 'Add') {
    if (previous) throw new Error('Add cannot reuse existing product id ' + id + '; ids are immutable.');
    const product = {};
    CATALOGUE.headers.forEach(function (field) {
      product[field] = action.values[field];
    });
    products.set(id, product);
    return;
  }
  if (mode === 'Update') {
    if (!previous) throw new Error('Cannot update unknown product id ' + id + '. Submit Add first.');
    const product = Object.assign({}, previous);
    CATALOGUE.headers.slice(1).forEach(function (field) {
      if (action.values[field] !== '') product[field] = action.values[field];
    });
    products.set(id, product);
    return;
  }
  throw new Error('Action must be Add or Update.');
}

function validateCatalogue_(products) {
  if (products.size > CATALOGUE.maxRows) throw new Error('Catalogue cannot exceed 500 rows.');
  const skus = new Set();
  const sortOrders = new Set();

  products.forEach(function (product, id) {
    validateId_(id);
    requiredText_(product, 'sku', 1, 64);
    requiredText_(product, 'category', 2, 60);
    requiredText_(product, 'name', 2, 120);
    requiredText_(product, 'unit', 1, 30);
    requiredText_(product, 'image_path', 5, 200);
    requiredText_(product, 'image_alt', 5, 180);
    requiredText_(product, 'description', 10, 500);
    requiredText_(product, 'variant_note', 5, 300);

    if (!/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/.test(product.price_ngn) || Number(product.price_ngn) <= 0) {
      throw new Error(id + ': price_ngn must be a positive decimal with at most two decimal places.');
    }
    if (!/^\/(?!.*(?:\.\.|\/\/))[A-Za-z0-9._/-]+\.(?:avif|jpe?g|png|webp)$/i.test(product.image_path)) {
      throw new Error(id + ': image_path must be a safe local image path.');
    }
    if (product.active !== 'TRUE' && product.active !== 'FALSE') {
      throw new Error(id + ': active must be TRUE or FALSE.');
    }
    if (!/^(?:0|[1-9]\d{0,3})$/.test(product.sort_order)) {
      throw new Error(id + ': sort_order must be an integer from 0 to 9999.');
    }
    if (skus.has(product.sku)) throw new Error(id + ': duplicate sku ' + product.sku + '.');
    if (sortOrders.has(product.sort_order)) {
      throw new Error(id + ': duplicate sort_order ' + product.sort_order + '.');
    }
    skus.add(product.sku);
    sortOrders.add(product.sort_order);
  });
}

function validateId_(id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length < 3 || id.length > 80) {
    throw new Error('id must be a 3-80 character immutable lowercase slug.');
  }
}

function requiredText_(product, field, min, max) {
  const value = String(product[field] || '').trim();
  if (value.length < min || value.length > max) {
    throw new Error(product.id + ': ' + field + ' must contain ' + min + '-' + max + ' characters.');
  }
  product[field] = value;
}

function writeProducts_(spreadsheet, products) {
  const rows = Array.from(products.values()).sort(function (left, right) {
    return (
      Number(left.sort_order) - Number(right.sort_order) ||
      (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
    );
  });
  const values = [CATALOGUE.headers].concat(
    rows.map(function (product) {
      return CATALOGUE.headers.map(function (field) {
        return product[field];
      });
    }),
  );
  const sheet = spreadsheet.getSheetByName(CATALOGUE.productsSheet) || spreadsheet.insertSheet(CATALOGUE.productsSheet);
  sheet.clearContents();
  sheet.getRange(1, 1, values.length, CATALOGUE.headers.length).setNumberFormat('@').setValues(values);
  sheet.setFrozenRows(1);
}

function writeSetupSheet_(spreadsheet, addForm, addSheet, archiveForm, archiveSheet) {
  const sheet = spreadsheet.getSheetByName(CATALOGUE.setupSheet) || spreadsheet.insertSheet(CATALOGUE.setupSheet);
  const rows = [
    ['Managed form', 'Response sheet', 'Edit URL (owner only)', 'Published/respondent URL', 'Current status'],
    formSetupRow_(CATALOGUE.addFormTitle, addForm, addSheet),
    formSetupRow_(CATALOGUE.archiveFormTitle, archiveForm, archiveSheet),
    [],
    [
      'Access reminder',
      'New Forms are closed by setup. Restrict responders to approved staff Google accounts, then open responses. Never collect customer/order data.',
    ],
    ['Published CSV sheet', CATALOGUE.productsSheet + ' only'],
    ['Last setup', new Date()],
  ];
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, 5).setValues(rows.map(function (row) {
    return row.concat(['', '', '', '', '']).slice(0, 5);
  }));
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 5);
}

function formSetupRow_(name, form, responseSheet) {
  return [
    name,
    responseSheet.getName(),
    form.getEditUrl(),
    form.getPublishedUrl(),
    form.isAcceptingResponses() ? 'Open; verify approved-account restriction' : 'Closed; restrict access before opening',
  ];
}

function ensureImportLog_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(CATALOGUE.logSheet) || spreadsheet.insertSheet(CATALOGUE.logSheet);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Logged at', 'Level', 'Source', 'Response row', 'Product id', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function log_(spreadsheet, level, source, rowNumber, id, message) {
  try {
    ensureImportLog_(spreadsheet).appendRow([new Date(), level, source, rowNumber, id, message]);
  } catch (ignored) {
    console.error(level + ' ' + source + ': ' + message);
  }
}

function assertHeaders_(headers, sheetName) {
  if (
    !headers ||
    headers.length !== CATALOGUE.headers.length ||
    CATALOGUE.headers.some(function (header, index) {
      return headers[index] !== header;
    })
  ) {
    throw new Error(sheetName + ' headers must exactly match: ' + CATALOGUE.headers.join(','));
  }
}

function rowToObject_(row) {
  const product = {};
  CATALOGUE.headers.forEach(function (header, index) {
    product[header] = String(row[index] == null ? '' : row[index]).trim();
  });
  return product;
}

function getSheetByStoredId_(spreadsheet, id) {
  return spreadsheet.getSheets().find(function (sheet) {
    return String(sheet.getSheetId()) === String(id);
  });
}

function withCatalogueLock_(operation) {
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) throw new Error('Another catalogue rebuild is in progress. Try again shortly.');
  try {
    return operation();
  } finally {
    lock.releaseLock();
  }
}
