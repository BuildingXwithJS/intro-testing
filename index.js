#!/usr/bin/env node
const yargs = require('yargs');

// init the main app
yargs.command(require('./main')).help().argv;
