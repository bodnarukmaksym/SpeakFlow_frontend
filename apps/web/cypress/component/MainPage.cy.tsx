import { MainPage } from '../../app/pages/main/MainPage';
import { BrowserRouter } from 'react-router-dom';

describe('MainPage', () => {
    beforeEach(() => {
        cy.login('fake-token');
        cy.mount(
            <BrowserRouter>
                <MainPage />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        cy.logout();
    });

    it('should render main page', () => {
        cy.contains('h2', 'Tools').should('be.visible');
    });

    it('should have all three tools displayed', () => {
        cy.contains('Transcription').should('be.visible');
        cy.contains('Summarizing').should('be.visible');
        cy.contains('Mood analysis').should('be.visible');
    });

    it('should have transcription selected by default', () => {
        cy.get('#tool-transcription').should('be.checked');
    });

    it('should allow selecting different tools', () => {
        cy.get('label[for="tool-summarizing"]').click();
        cy.get('#tool-summarizing').should('be.checked');

        cy.get('label[for="tool-mood"]').click();
        cy.get('#tool-mood').should('be.checked');
    });

    it('should display file upload area', () => {
        cy.contains('Drag and drop your MP3 file here').should('be.visible');
    });

    it('should show alert when processing without file', () => {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });

        cy.contains('button', 'Process Audio').click();
        cy.get('@alertStub').should('be.calledWith', 'Please upload an audio file first!');
    });

    it('should display feature status', () => {
        cy.contains('Status: Active').should('be.visible');
        cy.contains('Status: In development').should('be.visible');
    });

    it('should show mood analysis as in development', () => {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });

        cy.get('label[for="tool-mood"]').click();

        const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
        cy.get('#audio-input').selectFile(
            { contents: file, fileName: 'test.mp3' },
            { force: true }
        );

        cy.contains('button', 'Process Audio').click();
        cy.get('@alertStub').should('be.calledWith', 'Mood analysis feature is currently under development.');
    });

    it('should validate MP3 file format', () => {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });

        const file = new File([''], 'test.txt', { type: 'text/plain' });
        cy.get('#audio-input').selectFile(
            { contents: file, fileName: 'test.txt' },
            { force: true }
        );

        cy.get('@alertStub').should('be.calledWith', 'Please upload an MP3 audio file');
    });
});