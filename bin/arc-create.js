#! /usr/bin/env node

const program = require('commander')
const Creator = require('../src/creator')

program
  .option('--name [name]', '名称')
  .option('--description [description]', '介绍')
  .option('--author [author]', '作者')
  .option('--template [template]', '项目类型')
  .parse(process.argv)

const { name, description, author, template } = program

const creator = new Creator({ name, description, author, template, root: process.cwd() })

creator.create()
