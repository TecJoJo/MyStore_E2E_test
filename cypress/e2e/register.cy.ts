import { registerSelectors } from "../selectors/registerSelectors";
describe("Register a new user", () => {
  const validPassword = "Password123";
  const invalidPasswordWithOnlyNumbers = "1223456789";
  const invalidPasswordWithOnlyLetters = "abcdefghij";
  const invalidPasswordWithSpecialChars = "!@#$%^&*()_+";
  const invalidPasswordWithLessThan8Chars = "Pass1";

  const baseUrl = Cypress.env("baseUrl");
  const registerUrl = `${baseUrl}/register`;

  function getUniqueEmail() {
    const uniqueSuffix: string = Date.now().toString();
    return `cypress-${uniqueSuffix}@email.com`;
  }

  it("should register a new user", () => {
    const email = getUniqueEmail();
    cy.visit(registerUrl);

    cy.intercept({
      method: "POST",
      url: "**/api/auth/register",
    }).as("registerUser");
    cy.get(registerSelectors.email).type(email);
    cy.get(registerSelectors.password).type(validPassword);
    cy.get(registerSelectors.submit).click();
    cy.wait("@registerUser").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body.data.email).to.equal(email);
    });
    cy.get(registerSelectors.successMessage)
      .should("exist")
      .should("include.text", "successful");
    cy.get(registerSelectors.errorMessage).should("not.exist");

    // Verify that the user is redirected to the login page
    cy.wait(3000).url().should("include", "/login");
  });

  // it("can't register with an existing email", () => {
  //   const email = getUniqueEmail();
  //   cy.visit(registerUrl);

  //   cy.intercept({
  //     method: "POST",
  //     url: "**/api/auth/register",
  //   }).as("registerUser");
  //   cy.get(registerSelectors.email).type(email);
  //   cy.get(registerSelectors.password).type(validPassword);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(200);
  //     expect(interception.response?.body.data.email).to.equal(email);
  //   });
  //   cy.get(registerSelectors.successMessage)
  //     .should("exist")
  //     .should("include.text", "successful");
  //   cy.get(registerSelectors.errorMessage).should("not.exist");

  //   // Try to register again with the same email
  //   cy.visit(registerUrl);
  //   cy.get(registerSelectors.email).type(email);
  //   cy.get(registerSelectors.password).type(validPassword);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(400);
  //   });
  //   cy.get(registerSelectors.errorMessage)
  //     .should("exist")
  //     .should("include.text", "Failed");
  // });

  // it("can't register with an invalid password", () => {
  //   const email = getUniqueEmail();
  //   cy.visit(registerUrl);

  //   cy.intercept({
  //     method: "POST",
  //     url: "**/api/auth/register",
  //   }).as("registerUser");

  //   // Test with password containing only numbers
  //   cy.get(registerSelectors.email).type(email);
  //   cy.get(registerSelectors.password).type(invalidPasswordWithOnlyNumbers);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(400);
  //   });
  //   cy.get(registerSelectors.errorMessage)
  //     .should("exist")
  //     .should("include.text", "Failed");

  //   // Test with password containing only letters
  //   cy.get(registerSelectors.email).clear().type(email);
  //   cy.get(registerSelectors.password)
  //     .clear()
  //     .type(invalidPasswordWithOnlyLetters);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(400);
  //   });
  //   cy.get(registerSelectors.errorMessage)
  //     .should("exist")
  //     .should("include.text", "Failed");

  //   // Test with password containing special characters
  //   cy.get(registerSelectors.email).clear().type(email);
  //   cy.get(registerSelectors.password)
  //     .clear()
  //     .type(invalidPasswordWithSpecialChars);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(400);
  //   });
  //   cy.get(registerSelectors.errorMessage)
  //     .should("exist")
  //     .should("include.text", "Failed");

  //   // Test with password less than 8 characters
  //   cy.get(registerSelectors.email).clear().type(email);
  //   cy.get(registerSelectors.password)
  //     .clear()
  //     .type(invalidPasswordWithLessThan8Chars);
  //   cy.get(registerSelectors.submit).click();
  //   cy.wait("@registerUser").then((interception) => {
  //     expect(interception.response?.statusCode).to.equal(400);
  //   });
  //   cy.get(registerSelectors.errorMessage)
  //     .should("exist")
  //     .should("include.text", "Failed");
  // });

  // it("login link should lead to the login page", () => {
  //   cy.visit(registerUrl);
  //   cy.get(registerSelectors.signInLink).click();
  //   cy.url().should("include", "/login");
  // });
});
