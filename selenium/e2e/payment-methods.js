const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('payment methods', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });
 
  // Remove .only and implement others test cases!
  it('change cash on delivery position', async () => {
    // Click in payment methods in side menu
    await driver.findElement(By.linkText('Payment methods')).click();

    // Type in value input to search for specify payment method
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in edit of the last payment method
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();

    // Type 1 in position field
    await driver.findElement(By.id('sylius_payment_method_position')).sendKeys('1');

    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    // Assert that payment method has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));
  });

  it('change cash on delivery name', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[buttons.length - 1].click();
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('new name');
    await driver.findElement(By.id('sylius_save_changes_button')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));

    const nameInputValue = await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).getText();
    assert(nameInputValue.includes('new name'));
  });


  it('create new offline payment method', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('code');
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('new payment method');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();


    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully created.'));

  });


  it('should not create new offline payment method without required code field', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('new payment method');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();


    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));

    const bodyError = await driver.findElement(By.tagName('body')).getText();
    assert(bodyError.includes('Please enter payment method code.'));

  });


  
  it('should not create new offline payment method without required name field', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('new payment');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();


    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));

    const bodyError = await driver.findElement(By.tagName('body')).getText();
    assert(bodyError.includes('Please enter payment method name.'));

  });



  it('should not create new offline payment method with code that already exists', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('cash_on_delivery');
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('code already exists');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();


    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));

    const bodyError = await driver.findElement(By.tagName('body')).getText();
    assert(bodyError.includes('The payment method with given code already exists.'));

  });


  ["blank space", "speci@l"].forEach( (value) =>
  it('should not create new offline payment method with invalid code', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys(value);
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('invalid code');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();
  

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));

    const bodyError = await driver.findElement(By.tagName('body')).getText();
    assert(bodyError.includes('Payment method code can only be comprised of letters, numbers, dashes and underscores.'));

  });
  

  it('delete payment method', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]')).click();
    await driver.findElement(By.id('offline')).click();
    await driver.findElement(By.id('sylius_payment_method_code')).sendKeys('to_be_deleted');
    await driver.findElement(By.id('sylius_payment_method_translations_en_US_name')).sendKeys('to be deleted');
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]')).click();

    await driver.findElement(By.linkText('Payment methods')).click();

    await driver.findElement(By.id('criteria_search_value')).sendKeys('to be deleted');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    await driver.findElement(By.css('*[class^="ui red labeled icon button"]')).last().click();
    await driver.findElement(By.id('confirmation-button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully deleted.'));

  });

  it('disable cash on delivery method', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon button "]')).last().click();

    await driver.findElement(By.id('sylius_payment_method_enabled'))//.uncheck({ force: true });
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]'))//.scrollIntoView().click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));

    const nameInputValue = await driver.findElement(By.id('sylius_payment_method_enabled')).getText();
    assert(nameInputValue.includes('not.be.checked'));

  });

  it('enable cash on delivery method', async () => {
    await driver.findElement(By.linkText('Payment methods')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('cash');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon button "]')).last().click();

    await driver.findElement(By.id('sylius_payment_method_enabled'))//.uncheck({ force: true });
    await driver.findElement(By.css('*[class="ui labeled icon primary button"]'))//.scrollIntoView().click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment method has been successfully updated.'));

    const nameInputValue = await driver.findElement(By.id('sylius_payment_method_enabled')).getText();
    assert(nameInputValue.includes('be.checked'));

  });


  )};
