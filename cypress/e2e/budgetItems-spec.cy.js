describe('POST budgetItems CRUD:', () => {
  beforeEach(() => {
    cy.request('POST', '/createBudgetItem', {
      id: '1a',
      budgetId: '1a',
      name: 'name',
      cost: 3.51,
      dueDate: 15,
    });
  });
  it('returns a list of a given budget\'s budgetItems\'', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: '1a'}).then((response) => {
      expect(response.body.BudgetItems[0]).to.have.property('budgetId', '1a');
      expect(response.body.BudgetItems[0]).to.have.property('name', 'name');
      expect(response.body.BudgetItems[0]).to.have.property('cost', 3.51);
      expect(response.body.BudgetItems[0]).to.have.property('dueDate', 15);
    });
  });
  it('reads a budgetItem', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: '1a'}).then((response) => {
      expect(response.body.BudgetItems.length).to.equal(1);
      cy.request('POST', '/readBudgetItem', {id: response.body.BudgetItems[0].id}).then((response) => {
        expect(response.body.Items[0].name).to.equal('name');
      });
    });

  })
  it('updates a budgetItem', () => {
    cy.request('POST', '/readBudgetItems', {budgetId: '1a'}).then((response) => {
      cy.request('POST', '/updateBudgetItem', {id: response.body.BudgetItems[0].id, name: 'edited Name', cost: 4.20, dueDate: 122});
      cy.request('POST', '/readBudgetItem', {id: response.body.BudgetItems[0].id}).then((response) => {
        console.log(response)
        expect(response.body.Items[0]).to.have.property('name', 'edited Name');
      });
    });
  });
  afterEach(() => {
    cy.request('POST', '/readBudgetItems', {budgetId: '1a'}).then((response) => {
      response.body.BudgetItems.forEach((budget) => {
        cy.request('DELETE', '/deleteBudgetItem', {id: budget.id});
      });
    });
  });
});
