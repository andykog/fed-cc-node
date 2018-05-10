import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import i18next from 'i18next';
import nock from 'nock';
import {I18nextProvider} from 'react-i18next';
import App from './App';
import translation from '../../assets/locale/messages_en.json';
import {baseURL} from '../../../test/test-common';
import eventually from 'wix-eventually';

const i18nData = {
  lng: 'en',
  keySeparator: '$',
  resources: {
    en: {translation}
  }
};

afterEach(() => {
  if (!nock.isDone()) {
    throw new Error(`pending mocks: ${nock.pendingMocks()}`);
  }
});

afterEach(() => {
  nock.cleanAll();
});

describe('App', () => {
  let wrapper;

  afterEach(() => wrapper.detach());

  it('renders a title correctly', () => {
    const siteId = '7e271ad0-26d0-4bc9-bd5c-152a18fb7ede';
    const myComment = {text: 'Hello World', author: 'Yaniv'};

    require('jsdom-global')(undefined, {url: `${baseURL}/?siteId=${siteId}`});

    nock(baseURL)
      .get(`/api/comments/${siteId}`)
      .reply(200, [myComment]);


    wrapper = mount(
      <I18nextProvider i18n={i18next.init(i18nData)}>
        <App/>
      </I18nextProvider>,
      {attachTo: document.createElement('div')}
    );

    return eventually(() =>
      expect(wrapper.find('li').at(0).text()).to.eq(`${myComment.text} | ${myComment.author}`));
  });
});
