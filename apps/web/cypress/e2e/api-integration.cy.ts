describe("API Integration with Real Backend", () => {
  const apiBaseUrl = Cypress.env("API_BASE_URL") || "http://localhost:8000";

  beforeEach(() => {
    cy.visit("/main");
    cy.window().then((win) => {
      cy.login();
    });
  });

  afterEach(() => {
    cy.logout();
  });

  it("uploads audio file for transcription", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("transcriptionUpload");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("fake audio data for testing"),
      fileName: "test-transcription.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@transcriptionUpload", { timeout: 30000 }).then((interception) => {
      expect(interception.request.headers).to.have.property("authorization");
      expect(interception.request.headers.authorization).to.include("Bearer");
    });
  });

  it("uploads audio file for summarization", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_summarizing`).as("summarizationUpload");

    cy.get("#tool-summarizing").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("fake audio data for testing"),
      fileName: "test-summarization.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@summarizationUpload", { timeout: 30000 }).then((interception) => {
      expect(interception.request.headers).to.have.property("authorization");
      expect(interception.request.headers.authorization).to.include("Bearer");
    });
  });

  it("sends correct file in FormData", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("uploadRequest");

    cy.get("#tool-transcription").check({ force: true });

    const fileName = "integration-test.mp3";
    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio content"),
      fileName: fileName,
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@uploadRequest").then((interception) => {
      const contentType = interception.request.headers["content-type"];
      expect(contentType).to.include("multipart/form-data");
    });
  });

  it("handles 401 unauthorized response", () => {
    cy.logout();

    cy.intercept("POST", `${apiBaseUrl}/get_transcription`, {
      statusCode: 401,
      body: { error: "Unauthorized" }
    }).as("unauthorizedRequest");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@unauthorizedRequest");
    cy.url().should("include", "/auth");
  });

  it("includes authorization header in all requests", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("authCheck");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test"),
      fileName: "auth-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@authCheck").its("request.headers.authorization").should("exist");
  });
});
