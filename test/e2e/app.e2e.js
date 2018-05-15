import {expect} from 'chai';
import env from './../environment';
import './e2e-common';
import {inputTestkitFactory} from 'wix-style-react/dist/testkit/puppeteer';
import {buttonTestkitFactory} from 'wix-style-react/dist/testkit/puppeteer';


const {server, rpcServer, beforeAndAfter} = env();

const SITE_ID = '7e271ad0-26d0-4bc9-bd5c-152a18fb7ede';

describe('React application', () => {
  beforeAndAfter();

  afterEach(() => rpcServer.reset());


  describe('open page', () => {
    it('should display comments', async () => {
      const myComment = {text: 'Hello World', author: 'Yaniv'};

      rpcServer
        .when('CommentsService', 'fetch')
        .respond(([reqSiteId]) => reqSiteId === SITE_ID ? [myComment] : null);

      const page = await browser.newPage();
      await page.goto(server.getUrl(`/?siteId=${SITE_ID}`));

      await page.waitForSelector('li', {timeout: 1000});

      expect(await page.$$eval('li', lis => Array.from(lis).map(li => li.innerText)))
        .to.eql([`${myComment.text} | ${myComment.author}`]);
    });

    it('should add comment', async () => {
      const myComment = {text: 'Additional comment', author: 'Yaniv'};

      const serverComments = []

      rpcServer
        .when('CommentsService', 'add')
        .respond(([siteId, newComment]) => {
          serverComments.push(newComment);
          return null;
        });

      rpcServer
        .when('CommentsService', 'fetch')
        .respond(() => serverComments);

      const page = await browser.newPage();
      await page.goto(server.getUrl(`/?siteId=${SITE_ID}`));

      const authorNameInputTK = await inputTestkitFactory({dataHook: 'author-name', page});
      const commentInputTK = await inputTestkitFactory({dataHook: 'comment', page});
      const submitButtonTK = await buttonTestkitFactory({dataHook: 'submit-comment', page});


      await authorNameInputTK.enterText(myComment.author);
      await commentInputTK.enterText(myComment.text);
      await submitButtonTK.click();


      await page.waitForSelector('li', {timeout: 1000});

      expect(await page.$$eval('li', lis => Array.from(lis).map(li => li.innerText)))
        .to.eql([`${myComment.text} | ${myComment.author}`]);

    });
  });
});
