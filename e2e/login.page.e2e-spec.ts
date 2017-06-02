import { browser, element, by } from 'protractor';
import { Utils } from './app.utils';

describe('Login screen', () => {
  let utils: Utils;

  beforeEach(() => {
    utils = new Utils();

    utils.navigateTo();
  });

  it('it should land on the login screen page', () => {
    expect(utils.waitForCurrentUrl()).toMatch(/\/login/);
  });

  it('and a login form should be rendered on the page', () => {
    expect(utils.waitForElement(element(by.css('md-card.form__login'))))
      .toBe(true);

    expect(utils.waitForElement(element(by.css('md-card.form__login'))))
      .toBe(true);
  });

  it('and a register form should be rendered on the page', () => {
    expect(utils.waitForElement(element(by.css('md-card.form__register'))))
      .toBe(true);
  });

  describe('login form', () => {
    let submitBtn;

    beforeEach(() => {
      expect(utils.waitForCurrentUrl()).toMatch(/\/login/);
      utils.waitForElement(element(by.css('md-card.form__login button[type="submit"]')));
      submitBtn = element(by.css('md-card.form__login button[type="submit"]'));
    });

    it('the login button is initially disabled', () => {
      expect(submitBtn.getAttribute('disabled'))
        .toBe('true');
    });

    it('invalid email address', () => {
      element(by.css('md-card.form__login input[name="email"]'))
        .sendKeys('myemail.com');

      expect(submitBtn.getAttribute('disabled'))
        .toBe('true');
    });

    it('invalid password', () => {
      element(by.css('md-card.form__login input[name="email"]'))
        .sendKeys('myemail@test.com');

      element(by.css('md-card.form__login input[name="password"]'))
        .sendKeys('123');

      expect(submitBtn.getAttribute('disabled'))
        .toBe('true');
    });

    it('invalid credentials', () => {
      element(by.css('md-card.form__login input[name="email"]'))
        .sendKeys('e2e-automation@mailinator.com');

      element(by.css('md-card.form__login input[name="password"]'))
        .sendKeys('wrong-password');

      expect(submitBtn.getAttribute('disabled'))
        .toBe(null);

      submitBtn.click();

      expect(utils.waitForCurrentUrl()).not.toMatch(/\/dashboard/);

      expect(utils.waitForElement(element(by.css('.mat-simple-snackbar'))))
        .toBe(true);
    });

    it('valid credentials', () => {
      element(by.css('md-card.form__login input[name="email"]'))
        .sendKeys('e2e-automation@mailinator.com');

      element(by.css('md-card.form__login input[name="password"]'))
        .sendKeys('Protractor12345!@');

      expect(submitBtn.getAttribute('disabled'))
        .toBe(null);

      submitBtn.click();

      expect(utils.waitForCurrentUrl()).not.toMatch(/\/dashboard/);
      expect(utils.waitForCurrentUrl()).toMatch(/\/login/);

      expect(utils.waitForElement(element(by.css('.mat-simple-snackbar'))))
        .toBe(true);

      expect(element(by.css('.mat-simple-snackbar')).getText())
        .toEqual('Welcome back e2e-automation@mailinator.com');
    });
  });

  describe('forgotten password', () => {
    let forgottenPwdBtn;
    let dialog;

    beforeAll(() => {
      // force a user log out
      browser.driver.manage().deleteAllCookies();
      browser.executeScript('window.sessionStorage.clear(); window.localStorage.clear();');
      utils.navigateTo();
    });

    beforeEach(() => {
      expect(utils.waitForCurrentUrl()).toMatch(/\/login/);
      expect(utils.waitForElement(element(by.css('md-card.form__login button[name="forgotten_password"]'))))
        .toBe(true);

      // wait for animations to be completed
      browser.driver.sleep(400);

      forgottenPwdBtn = element(by.css('md-card.form__login button[name="forgotten_password"]'));
      dialog = element(by.css('app-dialog-reset-email'));
    });

    it('clicking the button should open a dialog', () => {
      forgottenPwdBtn.click();

      expect(utils.waitForElement(dialog))
        .toBe(true);

      expect(element(by.css('app-dialog-reset-email h2')).getText())
        .toEqual('Reset your password');
    });

    it('clicking outside the dialog should dismiss it', () => {
      forgottenPwdBtn.click();

      expect(utils.waitForElement(dialog))
        .toBe(true);

      browser.actions().mouseMove(dialog, {x: -100, y: -100}).click().perform();

      expect(utils.waitForElementToDisappear(dialog))
        .toBe(true);
    });

    it('the reset button should be disabled until a valid email address is provided', () => {

    });

    it('clicking the reset button should display a loading spinner', () => {

    });

    it('clicking the reset button should display a notification message', () => {

    });

    it('clicking the reset button should dismiss the dialog', () => {

    });
  });

  describe('register form', () => {
    it('the register button is initially disabled', () => {

    });

    it('invalid email address', () => {

    });

    it('invalid password', () => {

    });

    it('invalid password confirmation', () => {

    });

    it('display name is a mandatory field', () => {

    });

    it('invalid display name', () => {

    });

    it('valid form', () => {

    });
  });

});
