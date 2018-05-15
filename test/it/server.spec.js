import {expect} from 'chai';
import axios from 'axios';
import adapter from 'axios/lib/adapters/http';
import env from './../environment';
import {baseURL} from '../test-common';
import {wixAxiosInstanceConfig} from 'wix-axios-config';

const {server, rpcServer, beforeAndAfter} = env();
const axiosInstance = wixAxiosInstanceConfig(axios, {baseURL, adapter});

describe('When rendering', () => {
  beforeAndAfter();

  afterEach(() => rpcServer.reset());
  it('fetches', async () => {
    const siteId = '7e271ad0-26d0-4bc9-bd5c-152a18fb7edx';
    const myComment = {text: 'Hello World', author: 'Yaniv'};
    rpcServer
      .when('CommentsService', 'fetch')
      .respond(([reqSiteId]) => reqSiteId === siteId ? [myComment] : null);

    const url = server.getUrl(`/api/comments/${siteId}`);
    const response = await axiosInstance.get(url);

    expect(response.data).to.eql([myComment]);
  });

  it('adds comment', async () => {
    const siteId = '7e271ad0-26d0-4bc9-bd5c-152a18fb7edx';
    const myComment = {text: 'Hello World', author: 'Yaniv'};

    const serverComments = [];

    rpcServer
      .when('CommentsService', 'add')
      .respond(([siteId, newComment]) => {
        serverComments.push(newComment);
        return null;
      });

    rpcServer
      .when('CommentsService', 'fetch')
      .respond(() => serverComments);

    const url = server.getUrl(`/api/comments/${siteId}`);
    const response = await axiosInstance.post(url,  myComment);

    expect(response.data).to.eql([myComment]);
  });
});
