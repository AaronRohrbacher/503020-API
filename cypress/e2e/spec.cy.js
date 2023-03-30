describe('POST userBudgets:', () => {
  beforeEach(() => {
    cy.request('POST', '/budgets', {userId: '1a', budgetName: 'Happy Budget'});
  });
  it('returns a list of a given user\'s budgets', () => {
    cy.request('POST', '/userBudgets', {userId: '1a'}).then((response) => {
      expect(response.body.Items[0]).to.have.property('userId', '1a');
      expect(response.body.Items[0]).to.have.property('budgetName', 'Happy Budget');
    });
  });
});
