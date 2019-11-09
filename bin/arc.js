#! /usr/bin/env node

const getPkgVersion = require('../utils').getPkgVersion
const program = require('commander')

program
  .version(getPkgVersion())
  .usage('<command> [options]')
  .command('create [projectName]', 'Create a vue project')
  .command('config [templateSources]', 'Config templateSources')
  .parse(process.argv)
