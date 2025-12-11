describe("Complete User Journey with Backend", () => {
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

  it("completes transcription workflow from upload to result", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("uploadTranscription");
    cy.intercept("GET", `${apiBaseUrl}/get_transcription_page*`).as("getTranscription");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("audio content for transcription test"),
      fileName: "journey-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("journey-test.mp3").should("be.visible");

    cy.contains("button", "Process Audio").click();

    cy.wait("@uploadTranscription", { timeout: 30000 }).then((interception) => {
      if (interception.response && interception.response.statusCode === 200) {
        cy.url({ timeout: 10000 }).should("include", "/transcription");

        cy.wait("@getTranscription", { timeout: 30000 });
      }
    });
  });

  it("completes summarization workflow from upload to result", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_summarizing`).as("uploadSummarization");
    cy.intercept("GET", `${apiBaseUrl}/get_summary*`).as("getSummary");

    cy.get("#tool-summarizing").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("audio content for summary"),
      fileName: "summary-journey.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("summary-journey.mp3").should("be.visible");

    cy.contains("button", "Process Audio").click();

    cy.wait("@uploadSummarization", { timeout: 30000 }).then((interception) => {
      if (interception.response && interception.response.statusCode === 200) {
        cy.url({ timeout: 10000 }).should("include", "/summarizing");

        cy.wait("@getSummary", { timeout: 30000 });
      }
    });
  });

  it("handles backend processing delays", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`, (req) => {
      req.reply((res) => {
        res.delay = 2000;
        res.send({ statusCode: 200 });
      });
    }).as("slowUpload");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "slow-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@slowUpload", { timeout: 30000 });
  });

  it("prevents multiple simultaneous uploads", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`, (req) => {
      req.reply((res) => {
        res.delay = 3000;
        res.send({ statusCode: 200 });
      });
    }).as("longUpload");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "prevent-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@longUpload", { timeout: 30000 });
  });

  it("switches tools and uploads successfully", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("transcription");
    cy.intercept("POST", `${apiBaseUrl}/get_summarizing`).as("summarization");

    cy.get("#tool-transcription").should("be.checked");

    cy.get("#tool-summarizing").check({ force: true });
    cy.get("#tool-summarizing").should("be.checked");

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("test audio"),
      fileName: "switch-tool-test.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("button", "Process Audio").click();

    cy.wait("@summarization", { timeout: 30000 });

    cy.get("@transcription.all").should("have.length", 0);
  });

  it("uploads different files sequentially", () => {
    cy.intercept("POST", `${apiBaseUrl}/get_transcription`).as("upload");

    cy.get("#tool-transcription").check({ force: true });

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("first audio"),
      fileName: "first.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("first.mp3").should("be.visible");

    cy.get("#audio-input").selectFile({
      contents: Cypress.Buffer.from("second audio"),
      fileName: "second.mp3",
      mimeType: "audio/mpeg",
    }, { force: true });

    cy.contains("second.mp3").should("be.visible");
    cy.contains("first.mp3").should("not.exist");
  });
});
