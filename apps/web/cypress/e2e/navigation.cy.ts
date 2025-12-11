describe("Navigation", () => {
  it("redirects from root to /main", () => {
    cy.visit("/");
    cy.url().should("include", "/main");
  });

  it("navigates to auth page", () => {
    cy.visit("/auth");
    cy.url().should("include", "/auth");
    cy.contains("SpeakFlow").should("be.visible");
    cy.contains("Sign in with Google").should("be.visible");
  });

  it("navigates to main page", () => {
    cy.visit("/main");
    cy.url().should("include", "/main");
    cy.contains("Tools").should("be.visible");
  });

  it("shows 404 page for invalid routes", () => {
    cy.visit("/invalid-route");
    cy.url().should("include", "/invalid-route");
  });
});
