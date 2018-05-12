import {expect} from 'chai';
import env from './../environment';
import './e2e-common';

const {server, rpcServer, beforeAndAfter} = env();

describe('React application', () => {
  beforeAndAfter();

  afterEach(() => rpcServer.reset());


  describe('open page', () => {
    it('should display title', async () => {
      const siteId = '7e271ad0-26d0-4bc9-bd5c-152a18fb7ede';
      const myComment = {text: 'Hello World', author: 'Yaniv'};

      rpcServer
        .when('CommentsService', 'fetch')
        .respond(([reqSiteId]) => reqSiteId === siteId ? [myComment] : null);

      const page = await browser.newPage();
      await page.goto(server.getUrl(`/?siteId=${siteId}`));

      await page.waitForSelector('li', {timeout: 1000});

      expect(await page.$$eval('li', lis => Array.from(lis).map(li => li.innerText)))
        .to.eql([`${myComment.text} | ${myComment.author}`]);
    });
  });
});
