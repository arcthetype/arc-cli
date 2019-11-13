#! /usr/bin/env node

const program = require('commander')
const Creator = require('../src/creator')

program
  .option('--description [description]', '介绍')
  .option('--author [author]', '作者')
  .option('--template [template]', '项目类型')
  .parse(process.argv)

const name = program.args[0]
const { description, author, template } = program

const creator = new Creator({ name, description, author, root: process.cwd() })

creator.create()
