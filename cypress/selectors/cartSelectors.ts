export const cart = {
  cartTitle: '[data-cy="cart-title"]',
  closeButton: '[data-cy="cart-close-button"]',
  emptyCartMessage: '[data-cy="empty-cart-message"]',
  deliveryPrice: '[data-cy="cart-delivery-price"]',
  totalPrice: '[data-cy="cart-total-price"]',
  checkoutButton: '[data-cy="cart-checkout-button"]',
  cartContainer: '[data-cy="cart-container"]',
};

export const shoppingItem = {
  image: '[data-cy="shoppingItem-image"]',
  name: '[data-cy="shoppingItem-name"]',
  color: '[data-cy="shoppingItem-color"]',
  size: '[data-cy="shoppingItem-size"]',
  quantity: '[data-cy="shoppingItem-quantity"]',
  quantityIncrease: '[data-cy="shoppingItem-quantity-increase"]',
  quantityDecrease: '[data-cy="shoppingItem-quantity-decrease"]',
  ShoppingItemDelete: '[data-cy="shoppingItem-delete"]',
  price: '[data-cy="shoppingItem-price"]',
  shoppingItemContainer: '[data-cy="shoppingItem-container"]',
};

export const cartSelectors = {
  ...cart,
  ...shoppingItem,
};
