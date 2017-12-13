const fetch = require('node-fetch');
const chalk = require('chalk');
const inquirer = require('inquirer');
const opn = require('opn');

const generateDataUrl = (id, name) =>
  `http://steamcommunity.com/market/priceoverview/` +
  `?appid=${id}&country=DE&currency=3&market_hash_name=${encodeURIComponent(name.toUpperCase())}`;
const generateUserUrl = (id, name) =>
  `http://steamcommunity.com/market/listings/${id}/${encodeURIComponent(name.toUpperCase())}`;

exports.command = '*';
exports.describe = 'get prices for given app id and item name';
exports.builder = {
  id: {
    default: '578080',
  },
  name: {
    default: 'GAMESCOM INVITATIONAL CRATE',
  },
};
exports.handler = async ({id, name}) => {
  const dataUrl = generateDataUrl(id, name);

  const result = await fetch(dataUrl).then(r => r.json());

  console.log(`Right now ${chalk.bold('Gamescom Invitational Crate')} costs:
    ${chalk.gray('- Lowest price:')} ${chalk.green(result.lowest_price)}
    ${chalk.gray('- Median price:')} ${chalk.blue(result.median_price)}
    ${chalk.gray('- Volume:')} ${chalk.yellow(result.volume)}`);

  const prompts = [
    {
      type: 'confirm',
      name: 'openBrowser',
      message: 'Do you want to open the page in browser?',
      default: false,
    },
  ];
  const {openBrowser} = await inquirer.prompt(prompts);
  if (openBrowser) {
    const userUrl = generateUserUrl(id, name);
    opn(userUrl, {wait: false});
  }
};
