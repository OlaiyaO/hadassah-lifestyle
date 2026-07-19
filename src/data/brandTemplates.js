export const brandTemplates = [
  {
    slug: 'business-card',
    title: 'Business card',
    type: 'Identity',
    description: 'Ajoke Ola contact card, ready for print or PDF.',
  },
  {
    slug: 'letterhead',
    title: 'Letterhead',
    type: 'Correspondence',
    description: 'A4 first-page letter for formal communication.',
  },
  {
    slug: 'invoice',
    title: 'Invoice',
    type: 'Finance',
    description: 'Itemised customer billing with editable payment fields.',
  },
  {
    slug: 'quotation',
    title: 'Quotation',
    type: 'Sales',
    description: 'Professional pricing proposal before an order.',
  },
  {
    slug: 'receipt',
    title: 'Receipt',
    type: 'Finance',
    description: 'Customer proof of payment and transaction record.',
  },
  {
    slug: 'purchase-order',
    title: 'Purchase order',
    type: 'Procurement',
    description: 'Supplier order with quantities and approval fields.',
  },
  {
    slug: 'delivery-note',
    title: 'Delivery note',
    type: 'Fulfilment',
    description: 'Dispatch record with recipient confirmation.',
  },
  {
    slug: 'order-form',
    title: 'Customer order form',
    type: 'Sales',
    description: 'Structured clothing, shoe, bag or kitchen order.',
  },
  {
    slug: 'return-form',
    title: 'Return and exchange form',
    type: 'Service',
    description: 'Clear return reason, condition and resolution record.',
  },
  {
    slug: 'inventory-sheet',
    title: 'Inventory sheet',
    type: 'Operations',
    description: 'Simple SKU, quantity, cost and reorder tracker.',
  },
  {
    slug: 'email-signature',
    title: 'Email signature',
    type: 'Digital',
    description: 'Consistent owner signature for business email.',
  },
  {
    slug: 'social-card',
    title: 'Social product card',
    type: 'Marketing',
    description: 'Reusable square campaign and product announcement.',
  },
  {
    slug: 'thank-you-card',
    title: 'Thank-you card',
    type: 'Packaging',
    description: 'A polished insert for every customer order.',
  },
];

export function getBrandTemplate(slug) {
  return brandTemplates.find((template) => template.slug === slug);
}
