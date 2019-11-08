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
    console.log(symbols.info, 'arc config flush <key>');
    console.log(symbols.info, 'arc config flushall');
    console.log(symbols.info, 'arc config list/ls');
  })
  .parse(process.argv);

const args = program.args;
const [cmd, key, value] = args;


switch (cmd) {
  case 'get':
    if (!key) return console.log(symbols.error, chalk.red('配置项key不能为空！'));
    cfg.getGlobalConfig(key);
    break;
  case 'set':
    if (!key || !value) return console.log(symbols.error, chalk.red('配置项key/value不能为空！'));
    cfg.setGlobalConfig(key, value);
    break;
  case 'flush':
    if (!key) return console.log(symbols.error, chalk.red('配置项key不能为空！'));
    cfg.rmGlobalConfig(key);
    break;
  case 'flushall':
    cfg.flushGlobalConfig(key, true);
    break;
  case 'list':
  case 'ls':
    cfg.getGlobalConfig(key, true);
}





