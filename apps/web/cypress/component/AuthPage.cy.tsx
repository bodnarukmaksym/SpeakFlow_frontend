import { AuthPage } from '../../app/pages/auth/AuthPage';
import { BrowserRouter } from 'react-router-dom';

describe('AuthPage', () => {
    beforeEach(() => {
        cy.mount(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );
    });

    it('should render the page title', () => {
        cy.contains('SpeakFlow').should('be.visible');
    });

    it('should display welcome text', () => {
        cy.contains('SpeakFlow is a university project').should('be.visible');
        cy.contains('Sign in to start processing your audio').should('be.visible');
    });

    it('should have Google sign-in button', () => {
        cy.contains('button', 'Sign in with Google').should('be.visible');
    });

    it('should have Google icon in button', () => {
        cy.contains('button', 'Sign in with Google').within(() => {
            cy.get('svg').should('exist');
        });
    });

    it('should display footer badge', () => {
        cy.contains('Created by Human').should('be.visible');
    });
});