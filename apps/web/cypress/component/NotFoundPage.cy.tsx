import { NotFoundPage } from '../../app/pages/notFoundPage/NotFoundPage';
import { BrowserRouter } from 'react-router-dom';

describe('NotFoundPage', () => {
    beforeEach(() => {
        cy.mount(
            <BrowserRouter>
                <NotFoundPage />
            </BrowserRouter>
        );
    });

    it('should render 404 error code', () => {
        cy.contains('h1', '404').should('be.visible');
    });

    it('should display error title', () => {
        cy.contains('h2', 'Page Not Found').should('be.visible');
    });

    it('should display error message', () => {
        cy.contains("The page you are looking for doesn't exist or has been moved").should('be.visible');
    });

    it('should have error icon', () => {
        cy.get('[class*="errorIcon"]').find('svg').should('exist');
    });

    it('should have "Go to Main Page" button', () => {
        cy.contains('button', 'Go to Main Page').should('be.visible');
    });

    it('should have "Go Back" button', () => {
        cy.contains('button', 'Go Back').should('be.visible');
    });

    it('should navigate to main page on button click', () => {
        cy.contains('button', 'Go to Main Page').click();
        cy.url().should('include', '/main');
    });

    it('should have footer badge', () => {
        cy.contains('Created by Human').should('be.visible');
    });
});