import { GoogleAuthCallbackPage } from '../../app/pages/google_auth_callback/GoogleAuthCallbackPage';
import { MemoryRouter } from 'react-router-dom';

describe('GoogleAuthCallbackPage', () => {
    afterEach(() => {
        cy.window().then((win) => {
            win.history.pushState({}, '', '/');
        });
    });

    it('should show warning when no code provided', () => {
        cy.window().then((win) => {
            win.history.pushState({}, '', '/auth/callback');
        });

        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.contains('No authorization code received').should('be.visible');
    });

    it('should show loading state during authorization', () => {
        cy.intercept('POST', '**/auth/google/callback', {
            statusCode: 200,
            delay: 1000,
            body: { access_token: 'test-token' },
        }).as('authCallback');

        cy.window().then((win) => {
            win.history.pushState({}, '', '/auth/callback?code=test-code');
        });

        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.contains('Handling authorization...').should('be.visible');
    });

    it('should handle successful authorization', () => {
        cy.intercept('POST', '**/auth/google/callback', {
            statusCode: 200,
            body: { access_token: 'test-token-123' },
        }).as('authCallback');

        cy.window().then((win) => {
            win.history.pushState({}, '', '/auth/callback?code=valid-code');
        });

        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.wait('@authCallback');
        cy.contains('✓ Authorization successful!').should('be.visible');
        cy.contains('Redirecting to main page...').should('be.visible');
    });

    it('should save token to localStorage', () => {
        cy.intercept('POST', '**/auth/google/callback', {
            statusCode: 200,
            body: { access_token: 'saved-token' },
        }).as('authCallback');

        cy.window().then((win) => {
            win.history.pushState({}, '', '/auth/callback?code=valid-code');
        });

        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.wait('@authCallback');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('speakflow_access_token')).to.equal('saved-token');
        });
    });

    it('should show error on failed authorization', () => {
        cy.intercept('POST', '**/auth/google/callback', {
            statusCode: 500,
        }).as('authCallback');

        cy.window().then((win) => {
            win.history.pushState({}, '', '/auth/callback?code=bad-code');
        });

        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.wait('@authCallback');
        cy.contains('Authorization failed').should('be.visible');
    });

    it('should have back to auth link', () => {
        cy.mount(
            <MemoryRouter>
                <GoogleAuthCallbackPage />
            </MemoryRouter>
        );

        cy.contains('a', '← Back to Auth').should('have.attr', 'href', '/auth');
    });
});