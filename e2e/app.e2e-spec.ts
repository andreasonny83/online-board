import { RetroNotesPage } from './app.po';

describe('retro-notes App', () => {
  let page: RetroNotesPage;

  beforeEach(() => {
    page = new RetroNotesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
