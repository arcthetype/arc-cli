#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const symbols = require('log-symbols');
const cfg = require('../utils/cfgTools');


program
    .on('--help', () => {
        console.log('可选操作：');
        console.log(symbols.info, 'arc config set <key> <value>');
        console.log(symbols.info, 'arc config get <key>');
        console.log(symbols.info, 'arc config rm <key>');
        console.log(symbols.info, 'arc config list/ls');
    })
    .parse(process.argv);

const args = program.args;
const [cmd, key, value] = args;

switch (cmd) {
    case 'get':
        if (key) {
            cfg.getGlobalConfig(key)
        }
        break;
    case 'set':
        if (key && value) {
            cfg.setGlobalConfig(key, value)
        }

}






