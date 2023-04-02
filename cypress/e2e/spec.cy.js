describe('POST userBudgets:', () => {
  beforeEach(() => {
    cy.request('POST', '/budgets', {userId: '1a', budgetName: 'Happy Budget'});
    cy.request('POST', '/budgets', {userId: '1b', budgetName: 'Sad Budget'});
    cy.request('POST', '/budgets', {userId: '1b', budgetName: 'Sorted Budget'});

  });
  it('returns a list of a given user\'s budgets', () => {
    cy.request('POST', '/userBudgets', {userId: '1a'}).then((response) => {
      console.log(response)
      expect(response.body.Items[0]).to.have.property('userId', '1a');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Happy Budget');
    });
    cy.request('POST', '/userBudgets', {userId: '1b'}).then((response) => {
      console.log(response)
      expect(response.body.Items[0]).to.have.property('userId', '1b');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Sad Budget');
    });
  });
  it('Sorts budgets by ID', () => {
    cy.request('POST', '/userBudgets', {userId: '1b'}).then((response) => {
      console.log(response)
      expect(response.body.Items[0]).to.have.property('userId', '1b');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Sad Budget');
      expect(response.body.Items[1]).to.have.property('userId', '1b');
      expect(response.body.Items[1]).to.have.property('budgetName', 'Sorted Budget');

    });

  })
  afterEach(() => {
    cy.request('POST', '/userBudgets', {userId: '1a'}).then((response) => {
      response.body.Items.forEach((budget) => {
        cy.request('DELETE', '/deleteBudget', {id: budget.id, budgetName: budget.budgetName});
      });
    });
    cy.request('POST', '/userBudgets', {userId: '1b'}).then((response) => {
      response.body.Items.forEach((budget) => {
        cy.request('DELETE', '/deleteBudget', {id: budget.id, budgetName: budget.budgetName});
      });
    });

  });
});
