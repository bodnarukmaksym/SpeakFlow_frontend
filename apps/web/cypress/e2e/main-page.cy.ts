describe("Main Page", () => {
  beforeEach(() => {
    cy.visit("/main");
  });

  it("displays the branding and logo", () => {
    cy.contains("SpeakFlow").should("be.visible");
    cy.get('svg').should("exist");
  });

  it("displays the tools section", () => {
    cy.contains("Tools").should("be.visible");
  });

  it("displays all tool options", () => {
    cy.contains("Transcription").should("be.visible");
    cy.contains("Summarizing").should("be.visible");
    cy.contains("Mood analysis").should("be.visible");
  });

  it("has transcription tool selected by default", () => {
    cy.get("#tool-transcription").should("be.checked");
  });

  it("allows selecting different tools", () => {
    cy.get("#tool-summarizing").check({ force: true });
    cy.get("#tool-summarizing").should("be.checked");
    cy.get("#tool-transcription").should("not.be.checked");

    cy.get("#tool-mood").check({ force: true });
    cy.get("#tool-mood").should("be.checked");
    cy.get("#tool-summarizing").should("not.be.checked");
  });

  it("displays file upload dropzone", () => {
    cy.contains("Drag and drop your MP3 file here").should("be.visible");
  });

  it("displays process audio button", () => {
    cy.contains("button", "Process Audio").should("be.visible");
    cy.get("button").contains("Process Audio").should("not.be.disabled");
  });

  it("displays feature descriptions", () => {
    cy.contains("Transcription").should("be.visible");
    cy.contains("Converts audio into text").should("be.visible");
    cy.contains("Status: Active").should("be.visible");

    cy.contains("Summarizing").should("be.visible");
    cy.contains("Automatically generates a concise summary").should("be.visible");

    cy.contains("Mood analysis").should("be.visible");
    cy.contains("Identifies the emotional tone").should("be.visible");
    cy.contains("Status: In development").should("be.visible");
  });

  it("displays footer", () => {
    cy.contains("Created by Human").should("be.visible");
  });

  it("has proper ARIA labels", () => {
    cy.get('main[aria-label="Main"]').should("exist");
    cy.get('section[aria-label="Workspace"]').should("exist");
    cy.get('fieldset[aria-label="Tool selection"]').should("exist");
  });
});
