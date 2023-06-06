describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  after(() => {
    cy.visit('/admin/payment-methods/');
    cy.get('[id="criteria_search_value"]').type('code');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui red labeled icon button"]').last().click();
    cy.get('[id="confirmation-button"]').click();
    cy.visit('/admin/payment-methods/');
    cy.get('[id="criteria_search_value"]').type('cash');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Cash on delivery');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();
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
    cy.visit('/admin/payment-methods/');
    cy.get('[id="criteria_search_value"]').type('cash');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button"]').last().click();
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new name');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully updated.');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').invoke('val').should('contain', 'new name');
  });

  it('create new offline payment method', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('code');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new payment method');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully created.');
  });

  it('should not create new offline payment method without required code field', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('new payment method');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Please enter payment method code.');
  });

  it('should not create new offline payment method without required name field', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('new payment');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Please enter payment method name.');
  });

  it('should not create new offline payment method with code that already exists', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('cash_on_delivery');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('code already exists');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'The payment method with given code already exists.');
  });

  ["blank space", "speci@l"].forEach( (value) => 
  it('should not create new offline payment method with invalid code', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type(value);
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('invalid code');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'Payment method code can only be comprised of letters, numbers, dashes and underscores.');
  }));

  it('delete payment method', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.get('[id="offline"]').click();
    cy.get('[id="sylius_payment_method_code"]').type('to_be_deleted');
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('to be deleted');
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.visit('/admin/payment-methods/');

    cy.get('[id="criteria_search_value"]').type('to be deleted');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('*[class^="ui red labeled icon button"]').last().click();
    cy.get('[id="confirmation-button"]').click();
    
    cy.get('body').should('contain', 'Payment method has been successfully deleted.');
  });

  it('disable cash on delivery method', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('[id="criteria_search_value"]').type('cash');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('[id="sylius_payment_method_enabled"]').uncheck({ force: true });
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully updated.');
    cy.get('[id="sylius_payment_method_enabled"]').should('not.be.checked');
  });

  it('enable cash on delivery method', () => {
    cy.visit('/admin/payment-methods/');
    cy.get('[id="criteria_search_value"]').type('cash');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();

    cy.get('[id="sylius_payment_method_enabled"]').check({ force: true });
    cy.get('*[class="ui labeled icon primary button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully updated.');
    cy.get('[id="sylius_payment_method_enabled"]').should('be.checked');
  });

});
