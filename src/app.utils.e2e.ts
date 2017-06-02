import { browser, element, by, ElementFinder } from 'protractor';

export class Utils {
  private timeout: number;

  constructor() {
    browser.ignoreSynchronization = true;
  }

  navigateTo(target = ''): any {
    browser.get(`/${target}`);
    browser.driver.sleep(250); // wait for routing animations to be completed
    return;
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

  waitForUrlChange(target: RegExp): any {
    expect(this.waitForCurrentUrl()).toMatch(target);
  }
}
