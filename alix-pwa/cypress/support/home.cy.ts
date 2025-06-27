/// <reference types="cypress" />

describe('Navigation depuis Accueil vers Article', () => {
    it('Accède à la commune et clique sur un article', () => {
      // Étape 1 : Accéder à la page d'accueil
      cy.visit('/');
  
      // Étape 2 : Cliquer sur le bouton "Ma commune"
      cy.get('[data-testid="button-home-ma-commune"]').click();
  
      // Étape 3 : Attendre les articles (tu peux adapter ce sélecteur si tu veux un loader par ex.)
      cy.get('[data-testid^="article-button-"]', { timeout: 10000 }).first().click();
  
      // Étape 4 : Vérifie qu'on est sur la page de détail
      cy.url().should('include', '/detail');
      cy.contains('Détail').should('exist'); // Par exemple, le titre du YellowBar
    });
  });
  