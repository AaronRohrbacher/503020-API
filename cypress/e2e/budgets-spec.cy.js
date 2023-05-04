describe('POST Budget CRUD:', () => {
  beforeEach(() => {
    cy.request('POST', '/createBudget', {userId: '1a', budgetName: 'Happy Budget', currentBankBalance: 0});
    cy.request('POST', '/createBudget', {userId: '1b', budgetName: 'Sad Budget', currentBankBalance: 10});
  });
  it('returns a list of a given user\'s budgets', () => {
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      expect(response.body.Items[0]).to.have.property('userId', '1a');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Happy Budget');
      expect(response.body.Items[0]).to.have.property('currentBankBalance', 0);
    });
    cy.request('POST', '/readBudgets', {userId: '1b'}).then((response) => {
      expect(response.body.Items[0]).to.have.property('userId', '1b');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Sad Budget');
      expect(response.body.Items[0]).to.have.property('currentBankBalance', 10);
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
  it('updates only bank balance attribute', () => {
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      cy.request('POST', '/updateBudget', {id: response.body.Items[0].id, userId: '1a', currentBankBalance: 1000});
      cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
        console.log(response);
        expect(response.body.Items[0]).to.have.property('currentBankBalance', 1000);
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
