describe('POST Budget CRUD:', () => {
  beforeEach(() => {
    cy.request('POST', '/createBudget', {userId: '1a', budgetName: 'Happy Budget'});
    cy.request('POST', '/createBudget', {userId: '1b', budgetName: 'Sad Budget'});
    cy.request('POST', '/createBudget', {userId: '1b', budgetName: 'Sorted Budget'});
  });
  it('returns a list of a given user\'s budgets', () => {
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      expect(response.body.Items[0]).to.have.property('userId', '1a');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Happy Budget');
    });
    cy.request('POST', '/readBudgets', {userId: '1b'}).then((response) => {
      expect(response.body.Items[0]).to.have.property('userId', '1b');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Sad Budget');
    });
  });
  it('updates a budget', () => {
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      cy.request('POST', '/updateBudget', {id: response.body.Items[0].id, budgetName: 'edited Name', userId: '1a'});
      cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
        expect(response.body.Items[0]).to.have.property('budgetName', 'edited Name');
      });
    });
  });
  afterEach(() => {
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      response.body.Items.forEach((budget) => {
        cy.request('DELETE', '/deleteBudget', {id: budget.id});
      });
    });
  });
});
