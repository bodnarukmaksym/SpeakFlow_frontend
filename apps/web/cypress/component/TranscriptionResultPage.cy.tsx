import { TranscriptionResultPage } from '../../app/pages/transcription/TranscriptionResultPage';
import { BrowserRouter } from 'react-router-dom';

describe('TranscriptionResultPage', () => {
    const setup = (delay = 100) => {
        cy.logout();
        cy.login('fake-token');

        cy.intercept('GET', '**/get_transcription_page*', {
            statusCode: 200,
            delay: delay,
            body: {
                transcription: [
                    { speaker: 1, text: 'Hello, welcome to the meeting.' },
                    { speaker: 2, text: 'Thank you for having me.' },
                    { speaker: 1, text: "Let's discuss the project timeline." },
                ],
            },
        }).as('getTranscription');

        cy.mount(
            <BrowserRouter>
                <TranscriptionResultPage />
            </BrowserRouter>
        );
    };

    it('should render page title', () => {
        setup();
        cy.contains('h1', 'Transcription Result').should('be.visible');
    });

    it('should display loading state initially', () => {
        setup(500);
        cy.contains('Loading...').should('be.visible');
    });

    it('should load and display transcription', () => {
        setup();
        cy.wait('@getTranscription');
        cy.contains('Speaker 1').should('be.visible');
        cy.contains('Hello, welcome to the meeting.').should('be.visible');
    });

    it('should display all speakers correctly', () => {
        setup();
        cy.wait('@getTranscription');
        cy.get('[class*="speakerBadge"]').should('have.length', 3);
    });

    it('should have action buttons', () => {
        setup();
        cy.wait('@getTranscription');
        cy.contains('button', 'Download PDF').should('be.visible');
        cy.contains('button', 'Save Result to Drive').should('be.visible');
        cy.contains('button', 'Back to main').should('be.visible');
    });

    it('should handle download PDF click', () => {
        setup();
        cy.wait('@getTranscription');

        cy.intercept('POST', '**/download_pdf', {
            statusCode: 200,
            body: new Blob(['pdf content'], { type: 'application/pdf' }),
        }).as('downloadPdf');

        cy.contains('button', 'Download PDF').click();
        cy.wait('@downloadPdf');
    });

    it('should navigate back to main page', () => {
        setup();
        cy.wait('@getTranscription');
        cy.contains('button', 'Back to main').click();
        cy.url().should('include', '/main');
    });

    it('should handle 401 unauthorized', () => {
        // Очищаємо стан вручну для цього тесту
        cy.logout();
        cy.login('fake-token');

        cy.intercept('GET', '**/get_transcription_page*', {
            statusCode: 401,
        }).as('unauthorized');

        cy.mount(
            <BrowserRouter>
                <TranscriptionResultPage />
            </BrowserRouter>
        );

        cy.wait('@unauthorized');
        cy.url().should('include', '/auth');
    });
});