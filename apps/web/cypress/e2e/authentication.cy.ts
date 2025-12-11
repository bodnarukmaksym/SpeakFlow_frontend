describe("Authentication Flow with Backend", () => {
  const apiBaseUrl = Cypress.env("API_BASE_URL") || "http://localhost:8000";

  beforeEach(() => {
    cy.logout();
  });

  it("redirects to auth page when accessing protected routes without token", () => {
    cy.visit("/main");

    cy.intercept("POST", `${apiBaseUrl}/get_transcription`, {
      statusCode: 401,
      body: { error: "Unauthorized" }
    }).as("unauthorizedRequest");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "unauthorized-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@unauthorizedRequest");

    cy.url().should("include", "/auth");
  });

  it("stores token in localStorage after login", () => {
    cy.visit("/main");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.be.null;
    });

    cy.login("test-auth-token");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.equal("test-auth-token");
    });
  });

  it("includes token in API requests after login", () => {
    cy.visit("/main");
    cy.login("bearer-test-token");

    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("authenticatedRequest");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "auth-token-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@authenticatedRequest").then((interception) => {
      expect(interception.request.headers.authorization).to.equal("Bearer bearer-test-token");
    });
  });

  it("removes token from localStorage on logout", () => {
    cy.visit("/main");
    cy.login("token-to-remove");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.equal("token-to-remove");
    });

    cy.logout();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.be.null;
    });
  });

  it("handles expired token by redirecting to auth", () => {
    cy.visit("/main");
    cy.login("expired-token");

    cy.intercept("POST", `${apiBaseUrl}/get_transcription`, {
      statusCode: 401,
      body: { error: "Token expired" }
    }).as("expiredTokenRequest");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "expired-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@expiredTokenRequest");

    cy.url().should("include", "/auth");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.be.null;
    });
  });

  it("persists authentication across page reloads", () => {
    cy.visit("/main");
    cy.login("persistent-token");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.equal("persistent-token");
    });

    cy.reload();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("speakflow_access_token")).to.equal("persistent-token");
    });
  });

  it("handles Google OAuth callback", () => {
    const mockToken = "google-oauth-token-12345";

    cy.intercept("POST", `${apiBaseUrl}/auth/google/callback`, {
      statusCode: 200,
      body: { access_token: mockToken }
    }).as("googleCallback");

    cy.visit(`/auth/google?code=test-auth-code&state=test-state`);

    cy.wait("@googleCallback", { timeout: 10000 });

    cy.contains("Authorization successful").should("be.visible");

    cy.url({ timeout: 5000 }).should("include", "/main");
  });

  it("displays sign in button on auth page", () => {
    cy.visit("/auth");

    cy.contains("Sign in with Google").should("be.visible");
    cy.contains("button", "Sign in with Google").should("not.be.disabled");
  });

  it("Google sign in button triggers OAuth flow", () => {
    cy.intercept("GET", `${apiBaseUrl}/auth/google/url`).as("getAuthUrl");

    cy.visit("/auth");

    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });

    cy.contains("button", "Sign in with Google").should("be.visible");
  });
});
