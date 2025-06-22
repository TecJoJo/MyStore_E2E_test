import { login } from "../utils/api/login";
import { credential } from "../models/constants";
import { navigationBarSelectors } from "../selectors/navigationBarSelectors";

const baseUrl = Cypress.env("baseUrl");
const homeUrl = `${baseUrl}/`;
const { email, password } = credential;
describe("Login with API request", () => {
  it("should login with valid credentials", () => {
    login(email, password);
    cy.visit(homeUrl);
    cy.then(() => {
      expect(localStorage.getItem("jwtToken")).to.exist;
    });

    cy.get(navigationBarSelectors.signOut)
      .should("exist")
      .should("include.text", "Sign Out");
  });
});
