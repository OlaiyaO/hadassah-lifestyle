import snapshot from './products.snapshot.json' with { type: 'json' };

export const MAX_CART_QUANTITY = 5;
export const products = snapshot.products;
export const catalogVersion = snapshot.catalogVersion;

const productsById = new Map(products.map((product) => [product.id, product]));

export function formatNaira(kobo) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export function validateCartItems(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > products.length) {
    throw new Error('Your cart is empty or invalid.');
  }

  const seen = new Set();
  const items = input.map((item) => {
    const product = item && typeof item.id === 'string' ? productsById.get(item.id) : null;
    const quantity = item?.quantity;

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) {
      throw new Error('One or more cart items are invalid.');
    }
    if (seen.has(product.id)) {
      throw new Error('Duplicate cart items are not allowed.');
    }

    seen.add(product.id);
    return { product, quantity, lineTotalKobo: product.priceKobo * quantity };
  });

  return {
    items,
    amountKobo: items.reduce((total, item) => total + item.lineTotalKobo, 0),
  };
}
