describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('change cash on delivery position', () => {
    // Click in payment methods in side menu
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 1 in position field
    cy.get('[id="sylius_payment_method_position"]').type('1');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method has been updated
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });

  it('change cash on delivery name', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('[id="criteria_search_value"]').type('cash');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new name');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully updated.');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').invoke('val').should('contain', 'new name');
  });

  it('create new offline payment method', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('code');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new payment method');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully created.');
  });

  it('should not create new offline payment method without required code field', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new payment method');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Please enter payment method code.');
  });

  it.only('should not create new offline payment method without required name field', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('new payment');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Please enter payment method name.');
  });

});
