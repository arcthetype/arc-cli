#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const symbols = require('log-symbols')
const cfg = require('../utils/cfg-tools')

program
  .on('--help', () => {
    console.log('可选操作：')
    console.log(symbols.info, 'arc config set <key> <value>')
    console.log(symbols.info, 'arc config get <key>')
    console.log(symbols.info, 'arc config flush <key>')
    console.log(symbols.info, 'arc config flushall')
    console.log(symbols.info, 'arc config list/ls')
  })
  .parse(process.argv)

const args = program.args
const [cmd, key, value] = args

switch (cmd) {
  case 'get':
    if (!key) return console.log(symbols.error, chalk.red('配置项key不能为空！'))
    cfg.getGlobalConfig(key).then(res => {
      console.log(symbols.success, chalk.green(JSON.stringify(res)))
    }).catch(err => {
      console.log(symbols.error, chalk.red(err.message))
    })
    break
  case 'set':
    if (!key || !value) return console.log(symbols.error, chalk.red('配置项key/value不能为空！'))
    cfg.setGlobalConfig(key, value).then(() => {
      console.log(symbols.success, chalk.green('设置配置成功'))
    }).catch(err => {
      console.log(symbols.error, chalk.red(err.message))
    })
    break
  case 'flush':
    if (!key) return console.log(symbols.error, chalk.red('配置项key不能为空！'))
    cfg.flushGlobalConfig(key).then(() => {
      console.log(symbols.success, chalk.green('删除配置成功'))
    }).catch(err => {
      console.log(symbols.error, chalk.red(err.message))
    })
    break
  case 'flushall':
    cfg.flushGlobalConfig(key, true).then(() => {
      console.log(symbols.success, chalk.green('清空配置成功'))
    }).catch(err => {
      console.log(symbols.error, chalk.red(err.message))
    })
    break
  case 'list':
  case 'ls':
    cfg.getGlobalConfig(key, true).then(res => {
      console.log(symbols.success, chalk.green(JSON.stringify(res)))
    }).catch(err => {
      console.log(symbols.error, chalk.red(err.message))
    })
}
