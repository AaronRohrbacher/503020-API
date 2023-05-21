describe('POST budgetItems CRUD:', () => {
  let budgetId;
  beforeEach(() => {
    cy.request('POST', '/createBudget', {
      budgetName: 'Budget',
      userId: '1a',
      currentBankBalance: 10,
    });
    cy.request('POST', '/readBudgets', {
      userId: '1a',
    }).then((result) => {
      budgetId = result.body.Items[0].id;
      cy.request('POST', '/createBudgetItem', {
        budgetId: budgetId,
        name: 'name',
        cost: 3.51,
        dueDate: 15,
      });
    });
  });
  it('returns a list of a given budget\'s budgetItems\'', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: budgetId}).then((response) => {
      expect(response.body.BudgetItems[0]).to.have.property('budgetId', budgetId);
      expect(response.body.BudgetItems[0]).to.have.property('name', 'name');
      expect(response.body.BudgetItems[0]).to.have.property('cost', 3.51);
      expect(response.body.BudgetItems[0]).to.have.property('dueDate', 15);
    });
  });
  it('reads a budgetItem', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: budgetId}).then((response) => {
      expect(response.body.BudgetItems.length).to.equal(1);
      cy.request('POST', '/readBudgetItem', {id: response.body.BudgetItems[0].id}).then((response) => {
        expect(response.body.Items[0].name).to.equal('name');
      });
    });
  });
  it('updates a budgetItem', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: budgetId}).then((response) => {
      cy.request('POST', '/updateBudgetItem', {id: response.body.BudgetItems[0].id, name: 'edited Name', cost: 4.20, dueDate: 122});
      cy.request('POST', '/readBudgetItem', {id: response.body.BudgetItems[0].id}).then((response) => {
        expect(response.body.Items[0]).to.have.property('name', 'edited Name');
      });
    });
  });
  afterEach(() => {
    cy.request('POST', '/readBudgets', {
      userId: '1a',
    }).then((result) => {
      const budgetId = result.body.Items[0].id;
      cy.request('POST', '/readBudgetItems', {budgetId: budgetId}).then((response) => {
        response.body.BudgetItems.forEach((budgetItem) => {
          cy.request('DELETE', '/deleteBudgetItem', {id: budgetItem.id});
        });
      });
    });
    cy.request('POST', '/readBudgets', {userId: '1a'}).then((response) => {
      response.body.Items.forEach((budget) => {
        cy.request('DELETE', '/deleteBudget', {id: budget.id});
      });
    });
  });
});
