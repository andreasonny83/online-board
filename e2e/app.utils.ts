import { browser, element, by, ElementFinder } from 'protractor';

export class Utils {
  private timeout: number;

  constructor() {
    // browser.ignoreSynchronization = true; // Enabling the ignoreSynchronization makes Protractor work
    this.timeout = 6000;
  }

  navigateTo(target?: string): any {
    return browser.get(`/${target || ''}`);
  }

  waitForCurrentUrl(): any {
    const timeout: number = this.timeout;

    return browser.driver.wait(() => {
      return browser.driver.getCurrentUrl().then((url: string) => {
        return url;
      }, (err: any) => {
        throw err;
      });
    }, timeout);
  }

  waitForElement(el: ElementFinder): any {
    const timeout: number = this.timeout;

    return browser.driver
      .wait(() => el.isPresent(), timeout)
      .then(() => {
         return browser.driver.wait(() => el.isDisplayed(), timeout);
      });
  }

  waitForElementToDisappear(el: ElementFinder): any {
    const timeout: number = this.timeout;

    return browser.driver
      .wait(() => el.isPresent().then((isPresent: boolean) => {
          return !isPresent;
        }), timeout);
  }
}
