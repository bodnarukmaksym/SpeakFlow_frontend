import "@testing-library/cypress/add-commands";

Cypress.Commands.add("login", (token?: string) => {
  const authToken = token || Cypress.env("AUTH_TOKEN") || "test-token";
  window.localStorage.setItem("speakflow_access_token", authToken);
});

Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("speakflow_access_token");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(token?: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}
