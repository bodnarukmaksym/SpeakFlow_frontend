describe("Auth Page", () => {
  beforeEach(() => {
    cy.visit("/auth");
  });

  it("displays the branding and logo", () => {
    cy.contains("SpeakFlow").should("be.visible");
    cy.get('svg').should("exist");
  });

  it("displays welcome message", () => {
    cy.contains("SpeakFlow is a university project").should("be.visible");
    cy.contains("Sign in to start processing your audio").should("be.visible");
  });

  it("displays Google sign-in button", () => {
    cy.contains("button", "Sign in with Google").should("be.visible");
    cy.get("button").contains("Sign in with Google").should("not.be.disabled");
  });

  it("displays footer", () => {
    cy.contains("Created by Human").should("be.visible");
  });

  it("has proper ARIA labels", () => {
    cy.get('main[aria-label="Authorization"]').should("exist");
  });
});
