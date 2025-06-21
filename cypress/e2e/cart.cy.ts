import { cartSelectors } from "../selectors/cartSelectors";
import { navigationBarSelectors } from "../selectors/navigationBarSelectors";

describe("Cart functionality", () => {
  let cartItemCount: number;
  let totalPrice: number;
  let deliveryPrice: number;
  const baseUrl = Cypress.env("baseUrl");
  const homeUrl = `${baseUrl}/`;
  const productsUrl = `${baseUrl}/products`;
  beforeEach(() => {
    //we want to make sure the cart is open before each test
    cy.visit(homeUrl);
    cy.get(navigationBarSelectors.cart).click();
    cy.then(() => {
      const cartContainerEl = Cypress.$(cartSelectors.cartContainer);
      //If the cart is closed because of the step above, we open it and check the it is open
      if (cartContainerEl.length === 0) {
        cy.get(navigationBarSelectors.cart).click();
        cy.get(cartSelectors.cartContainer).should("exist");
      }

      // Extract the cart item count from the cart title
      cy.get(cartSelectors.cartTitle)
        .should("exist")
        .then(($el) => {
          const titleText = $el.text();
          const parsedCartItemCount = parseInt(titleText.match(/\d+/)?.[0]);
          console.log("Parsed cart item count: ", parsedCartItemCount);

          if (isNaN(parsedCartItemCount)) {
            throw new Error(
              "Failed to extract any number from the Cart title, expected to find number indicating the cart items' count"
            );
          }
          cartItemCount = parsedCartItemCount;
        });

      // Extract the total price from the cart
      cy.get(cartSelectors.totalPrice)
        .should("exist")
        .then(($el) => {
          const totalPriceText = $el.text();
          const parsedTotalPrice = parseFloat(
            totalPriceText.replace(/[^0-9.-]+/g, "")
          );
          if (isNaN(parsedTotalPrice)) {
            throw new Error(
              "Failed to extract total price from the Cart, expected to find a valid number"
            );
          }
          totalPrice = parsedTotalPrice;
        });

      // Extract the delivery price from the cart
      cy.get(cartSelectors.deliveryPrice)
        .should("exist")
        .then(($el) => {
          const deliveryPriceText = $el.text();
          const parsedDeliveryPrice = parseFloat(
            deliveryPriceText.replace(/[^0-9.-]+/g, "")
          );
          if (isNaN(parsedDeliveryPrice)) {
            throw new Error(
              "Failed to extract delivery price from the Cart, expected to find a valid number"
            );
          }
          deliveryPrice = parsedDeliveryPrice;
        });
    });
  });
  it("should open the cart", () => {
    cy.get(cartSelectors.cartContainer).should("exist");
    console.log(
      "Cart is open, cart item count: ",
      cartItemCount,
      ", total price: ",
      totalPrice,
      ", delivery price: ",
      deliveryPrice
    );
  });
});
