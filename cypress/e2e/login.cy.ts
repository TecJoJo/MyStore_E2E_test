import { loginSelectors } from "../selectors/loginSelectors";
import { navigationBarSelectors } from "../selectors/navigationBarSelectors";
const credential = {
  email: "test@email.com",
  password: "Password123",
};

const wrongCrednetial = {
  email: "wrongCredential@email.com",
  password: "WrongPassword123",
};

const baseUrl = Cypress.env("baseUrl");
const loginUrl = `${baseUrl}/login`;

describe("Login a user", () => {
  it("should login with valid credentials", () => {
    cy.visit(loginUrl);
    cy.intercept({
      method: "POST",
      url: "**/api/auth/login",
    }).as("loginUser");
    cy.get(loginSelectors.email).type(credential.email);
    cy.get(loginSelectors.password).type(credential.password);
    cy.get(loginSelectors.submit).click();
    cy.wait("@loginUser").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body.username).to.equal(credential.email);
    });

    // Verify that the user is redirected to the home page
    cy.wait(3000)
      .url()
      .should("eq", baseUrl + "/");
    cy.get(navigationBarSelectors.signOut)
      .should("exist")
      .should("include.text", "Sign Out");
  });
  it("should not login with invalid credentials", () => {
    cy.visit(loginUrl);
    cy.intercept({
      method: "POST",
      url: "**/api/auth/login",
    }).as("loginUser");
    cy.get(loginSelectors.email).type(wrongCrednetial.email);
    cy.get(loginSelectors.password).type(wrongCrednetial.password);
    cy.get(loginSelectors.submit).click();
    cy.get(loginSelectors.errorMessage)
      .should("exist")
      .should("include.text", "Failed");
    cy.wait("@loginUser").then((interception) => {
      expect(interception.response?.statusCode).to.equal(400);
    });
  });
});
