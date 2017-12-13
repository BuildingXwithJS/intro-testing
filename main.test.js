/* eslint-env jest */
// npm packages
const nock = require('nock');
const sinon = require('sinon');
const inquirer = require('inquirer');

// our packages
const {getData, handler} = require('./main');

const gamescomCrate = {
  id: '578080',
  name: 'GAMESCOM INVITATIONAL CRATE',
};

// mock opn function
jest.mock('opn');
const opn = require('opn');

describe('Main function', () => {
  let steamcommunity;

  beforeAll(() => {
    const url =
      `/market/priceoverview/?appid=${gamescomCrate.id}&` +
      `country=DE&currency=3&market_hash_name=${encodeURIComponent(gamescomCrate.name)}`;
    steamcommunity = nock('http://steamcommunity.com')
      .get(url)
      .times(3)
      .reply(200, {
        lowest_price: '6,10€',
        median_price: '6,10€',
        success: true,
        volume: '8,472',
      });
  });

  afterAll(() => {
    steamcommunity.cleanAll();
  });

  test('Gets default data', async done => {
    const result = await getData(gamescomCrate);
    expect(result).toMatchSnapshot();
    done();
  });

  test('Renders correct data to a user', async done => {
    // stub the reply from user
    const inquirerStub = sinon.stub(inquirer, 'prompt').callsFake(() => ({openBrowser: false}));
    // tap into console.log function
    const consoleSpy = sinon.spy(console, 'log');
    // execute main login
    await handler(gamescomCrate);
    // remove console spy
    consoleSpy.restore();
    // validate output
    expect(consoleSpy.args).toMatchSnapshot();
    // restore inquirer
    inquirerStub.restore();
    done();
  });

  test('Opens browser on user request', async done => {
    // stub the reply from user
    const inquirerStub = sinon.stub(inquirer, 'prompt').callsFake(() => ({openBrowser: true}));
    // tap into console.log function
    const consoleSpy = sinon.spy(console, 'log');
    // execute main login
    await handler(gamescomCrate);
    // remove console spy
    consoleSpy.restore();
    // validate output
    expect(consoleSpy.args).toMatchSnapshot();
    // make sure opn was called
    expect(opn).toBeCalled();
    // restore inquirer
    inquirerStub.restore();
    done();
  });
});
