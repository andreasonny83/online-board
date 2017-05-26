import { browser, element, by } from 'protractor';
import { Utils } from './app.utils';

describe('Online Board App', () => {
  let utils: Utils;

  beforeEach(() => {
    utils = new Utils();

    utils.navigateTo();
  });

  it('should display the app toolbar', () => {
    const version = require('../package.json').version;

    expect(element(by.css('app-root .app-toolbar .toolbar-title')).getText())
      .toEqual(`Online Board v.${version}`);
  });

  it('should display a cookie policy notification', () => {
    expect(element(by.css('cookie-law[name="onlineBaordCookieLaw"] .cookie-law-wrapper')).isDisplayed())
      .toBe(true);
  });
});
