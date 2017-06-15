import { ConferenceRoomSchedulerPage } from './app.po';

describe('conference-room-scheduler App', () => {
  let page: ConferenceRoomSchedulerPage;

  beforeEach(() => {
    page = new ConferenceRoomSchedulerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
