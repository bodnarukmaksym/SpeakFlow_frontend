import { SummarizingResultPage } from '../../app/pages/summary_result/SummarizingResultPage';
import { BrowserRouter } from 'react-router-dom';

describe('SummarizingResultPage', () => {
    const setup = (delay = 100) => {
        cy.logout();
        cy.login('fake-token');

        cy.intercept('GET', '**/get_summary', {
            statusCode: 200,
            delay: delay,
            body: {
                summary: 'This is a test summary of the audio content.',
                key_points: [
                    'First key point',
                    'Second key point',
                    'Third key point',
                ],
                word_count: 150,
            },
        }).as('getSummary');

        cy.mount(
            <BrowserRouter>
                <SummarizingResultPage />
            </BrowserRouter>
        );
    };

    it('should render page title', () => {
        setup();
        cy.contains('h1', 'Summarizing Result').should('be.visible');
    });

    it('should display loading state', () => {
        setup(500);
        cy.contains('Loading summary...').should('be.visible');
    });

    it('should load and display summary', () => {
        setup();
        cy.wait('@getSummary');
        cy.contains('This is a test summary of the audio content.').should('be.visible');
    });

    it('should display word count', () => {
        setup();
        cy.wait('@getSummary');
        cy.contains('Word count:').should('be.visible');
        cy.contains('150').should('be.visible');
    });

    it('should display key points section', () => {
        setup();
        cy.wait('@getSummary');
        cy.contains('h2', 'Key Points').should('be.visible');
    });

    it('should display all key points', () => {
        setup();
        cy.wait('@getSummary');
        cy.contains('First key point').should('be.visible');
        cy.contains('Second key point').should('be.visible');
        cy.contains('Third key point').should('be.visible');
    });

    it('should have exactly 3 key points', () => {
        setup();
        cy.wait('@getSummary');
        cy.get('li[class*="keyPoint"]').should('have.length', 3);
    });

    it('should have action buttons', () => {
        setup();
        cy.wait('@getSummary');
        cy.contains('button', 'Download PDF').should('be.visible');
        cy.contains('button', 'Save Result to Drive').should('be.visible');
        cy.contains('button', 'Back to main').should('be.visible');
    });

    it('should handle save to drive', () => {
        setup();
        cy.wait('@getSummary');

        cy.intercept('POST', '**/save_summary_to_drive', {
            statusCode: 200,
            body: { message: 'Successfully saved!' },
        }).as('saveToDrive');

        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });

        cy.contains('button', 'Save Result to Drive').click();
        cy.wait('@saveToDrive');
        cy.get('@alertStub').should('be.calledWith', 'Successfully saved!');
    });
});