/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

Cypress.Commands.add('login', (token: string) => {
    return cy.window().then((win) => {
        win.localStorage.setItem('speakflow_access_token', token);
    });
});

Cypress.Commands.add('logout', () => {
    return cy.window().then((win) => {
        win.localStorage.removeItem('speakflow_access_token');
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(token: string): Chainable<AUTWindow>;
            logout(): Chainable<AUTWindow>;
        }
    }
}

export {};