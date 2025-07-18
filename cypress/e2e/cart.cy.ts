import { is } from "cypress/types/bluebird";
import { cartSelectors } from "../selectors/cartSelectors";
import { navigationBarSelectors } from "../selectors/navigationBarSelectors";
import { productsSelectors } from "../selectors/productsSelectors";
import { login } from "../utils/api/login";

describe("Cart functionality", () => {
  let cartItemCount: number;
  let totalPrice: number;
  let deliveryPrice: number;
  const baseUrl = Cypress.env("baseUrl");
  const homeUrl = `${baseUrl}/`;
  const productsUrl = `${baseUrl}/products`;
  let productDetailUrl: string;

  const isCartOpen = () => {
    return Cypress.$(cartSelectors.cartContainer).is(":visible");
  };

  const emptyCartMessage = "Your cart is empty";
  beforeEach(() => {
    //we want to make sure the cart is open before each test
    cy.visit(homeUrl);
    cy.get(navigationBarSelectors.cart).click();
    cy.then(() => {
      //If the cart is closed because of the step above, we open it and check the it is open
      if (!isCartOpen) {
        cy.get(navigationBarSelectors.cart).click();
        cy.get(cartSelectors.cartContainer).should("be.visible");
      }

      // Extract the cart item count from the cart title
      cy.get(cartSelectors.cartTitle)
        .should("exist")
        .then(($el) => {
          const titleText = $el.text();
          const parsedCartItemCount = parseInt(titleText.match(/\d+/)?.[0]);

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
  it("should open and close the cart", () => {
    cy.get(cartSelectors.cartContainer).should("be.visible");
    cy.get(cartSelectors.closeButton).click();
    cy.wait(500); // Wait for the cart to close
    cy.get(cartSelectors.cartContainer).should("not.be.visible");

    // Reopen the cart
    cy.get(navigationBarSelectors.cart).click();
    cy.get(cartSelectors.cartContainer).should("be.visible");
    cy.get(navigationBarSelectors.cart).click();
    cy.wait(500); // Wait for the cart to close
    cy.get(cartSelectors.cartContainer).should("not.be.visible");
  });
  it("should show empty cart message and zero prices when cart is empty", () => {
    cy.get(cartSelectors.shoppingItemContainer).then(($items) => {
      const itemCount = $items.length;
      expect(itemCount).to.be.greaterThan(
        0,
        "There should be at least one item in the cart before emptying it"
      );

      // Empty the cart by clicking the delete button on each item
      cy.get(cartSelectors.ShoppingItemDelete).each(($deleteButton) => {
        cy.wrap($deleteButton).click();
      });

      // Verify that the cart is empty, empty cart message is displayed, and prices are zero
      cy.get(cartSelectors.shoppingItemContainer).should("not.exist");
      cy.get(cartSelectors.emptyCartMessage)
        .should("exist")
        .should("have.text", emptyCartMessage);
      cy.get(cartSelectors.totalPrice)
        .should("exist")
        .and("include.text", "0.00");
      cy.get(cartSelectors.deliveryPrice)
        .should("exist")
        .and("include.text", "0.00");

      // Verify that the cart item count in the title is zero
      cy.get(cartSelectors.cartTitle).should("exist").and("include.text", "0");
    });
  });
  it("total price should be different when items' quantity is increased or decreased", () => {
    cy.get(cartSelectors.shoppingItemContainer).each(($item) => {
      cy.wrap($item)
        .find(cartSelectors.quantityIncrease)
        .click()
        .then(() => {
          // Verify that the total price has increased
          cy.get(cartSelectors.totalPrice).should(($totalPrice) => {
            const newTotalPrice = parseFloat(
              $totalPrice.text().replace(/[^0-9.-]+/g, "")
            );
            expect(newTotalPrice).to.be.greaterThan(totalPrice);
            totalPrice = newTotalPrice; // Update totalPrice for further checks
          });
        });

      cy.wrap($item)
        .find(cartSelectors.quantityDecrease)
        .click()
        .then(() => {
          // Verify that the total price has decreased
          cy.get(cartSelectors.totalPrice).should(($totalPrice) => {
            const newTotalPrice = parseFloat(
              $totalPrice.text().replace(/[^0-9.-]+/g, "")
            );
            expect(newTotalPrice).to.be.lessThan(totalPrice);
            totalPrice = newTotalPrice; // Update totalPrice for further checks
          });
        });
    });
  });

  it("total price should vary when item is removed from the cart", () => {
    cy.get(cartSelectors.shoppingItemContainer)
      .its("length")
      .should("be.greaterThan", 0);
    cy.get(cartSelectors.shoppingItemContainer).each(($item) => {
      cy.wrap($item)
        .find(cartSelectors.ShoppingItemDelete)
        .click()
        .then(() => {
          // Verify that the total price has decreased
          cy.get(cartSelectors.totalPrice).should(($totalPrice) => {
            const newTotalPrice = parseFloat(
              $totalPrice.text().replace(/[^0-9.-]+/g, "")
            );
            expect(newTotalPrice).to.be.lessThan(totalPrice);
            totalPrice = newTotalPrice; // Update totalPrice for further checks
          });
        });
    });
  });

  it("cart can be opened in products and productDetail view", () => {
    //we need to access the products thus we need to first login in
    login();

    // Open the cart from the products page
    cy.visit(productsUrl);
    cy.then(() => {
      if (isCartOpen()) {
        cy.get(cartSelectors.closeButton).click();
      }
    });

    cy.get(cartSelectors.cartContainer).should("be.hidden");
    cy.get(navigationBarSelectors.cart).click();
    cy.get(cartSelectors.cartContainer).should("be.visible");

    //extract the product detail URL from the first product
    cy.then(() => {
      if (isCartOpen()) {
        cy.get(cartSelectors.closeButton).click();
      }
    });

    cy.get(productsSelectors.singleProductLink)
      .first()
      .invoke("attr", "href")
      .then((href) => {
        const baseUrl = Cypress.env("baseUrl");
        productDetailUrl = `${baseUrl}${href}`;
      })
      .then(() => {
        cy.visit(productDetailUrl);
      });

    cy.get(cartSelectors.cartContainer).should("be.hidden");
    cy.get(navigationBarSelectors.cart).click();
    cy.get(cartSelectors.cartContainer).should("be.visible");
  });
});
