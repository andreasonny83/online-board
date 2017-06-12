import { browser, element, by } from 'protractor';
import { Utils } from '../app.utils.e2e';
const pkg = require('../../package.json');

describe('Online Board App', () => {
  let utils: Utils;

  beforeAll(() => {
    // force a user log out
    browser.driver.manage().deleteAllCookies();
  });

  beforeEach(() => {
    utils = new Utils();

    utils.navigateTo();
    utils.waitForUrlChange(/\/login/);
  });

  it('should display the app toolbar', () => {
    expect(element(by.css('app-root .app-toolbar .toolbar-title')).getText())
      .toEqual(`Online Board v.${pkg.version}`);
  });

  it('should display a cookie policy notification', () => {
    expect(element(by.css('cookie-law .cookie-law-wrapper')).isDisplayed())
      .toBe(true);
  });
});
