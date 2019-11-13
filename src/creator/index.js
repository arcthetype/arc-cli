const inquirer = require('inquirer')
const symbols = require('log-symbols')
const chalk = require('chalk')
const fs = require('fs-extra')
const ora = require('ora')
const path = require('path')
const cfg = require('../../utils/cfg-tools')
const { getUserHomeDir } = require('../../utils')
const config = require('../../config')
const repo = require('../../utils/repository')

/**
 * 创建工程的类
 */
class Creator {

  constructor({ name, description, author, template, root }) {
    /**
     * 项目根目录
     * @type {String}
     * @private
     */
    this._root = root
    /**
     * 项目名称
     * @type {String}
     * @private
     */
    this._name = name
    /**
     * 项目描述
     * @type {String}
     * @private
     */
    this._description = description
    /**
     * 作者
     * @type {String}
     * @private
     */
    this._author = author
    /**
     * 模板类型
     * @type {String}
     * @private
     */
    this._template = template
    /**
     * 用于询问的列表
     * @type {Array}
     * @private
     */
    this._ask = []
  }

  /**
   * 询问项目名称
   * @returns {string|boolean}
   */
  askProjectName() {
    let _this = this
    // 说明没有通过选项指定
    if (typeof this._name !== 'string') {
      this._ask.push({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        validate(input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '已经存在同名项目，请换一个项目名！'
          }
          _this._name = input
          return true
        }
      })
    } else if (fs.existsSync(this._name)) {
      this._ask.push({
        type: 'input',
        name: 'projectName',
        message: '已经存在同名项目，请换一个项目名',
        validate(input) {
          if (!input) {
            return '项目名不能为空！'
          }
          if (fs.existsSync(input)) {
            return '依旧重复，请再换一个项目名！'
          }
          _this._name = input
          return true
        }
      })
    }
  }

  /**
   * 询问项目描述
   */
  askDescription() {
    if (typeof this._description !== 'string') {
      this._ask.push({
        type: 'input',
        name: 'description',
        message: '请输入项目描述'
      })
    }
  }

  /**
   * 询问项目作者
   */
  askAuthor() {
    if (typeof this._author !== 'string') {
      this._ask.push({
        type: 'input',
        name: 'author',
        message: '请输入作者'
      })
    }
  }

  /**
   * 询问模板
   */
  async askTemplate() {
    
    const typeChoices = [
      {
        name: 'vue-pc',
        value: 'archetype-vue-pc'
      },
      {
        name: 'vue-app',
        value: 'archetype-vue-app'
      },
      {
        name: 'vue-admin',
        value: 'archetype-vue-admin'
      },
      {
        name: 'weapp',
        value: 'archetype-weapp'
      }
    ]
    this._ask.push({
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: typeChoices
    })
  }

  /**
   * 询问模板源
   */
  // askSource() {
  //   const typeChoices = ['default', 'remote']
  //   this._ask.push({
  //     type: 'list',
  //     name: 'templateSources',
  //     message: '请选择模板源',
  //     choices: typeChoices
  //   })
  // }

  /**
   * 创建
   */
  async create() {
    try {
      const { projectName, description, author, template } =  await this.clollectAsk()
      typeof projectName !== 'undefined' && (this._name = projectName)
      typeof description !== 'undefined' && (this._description = description )
      typeof author !== 'undefined' && (this._author = author)
      typeof template !== 'undefined' && (this._template = template)
      let list = await repo.getTemplatesList()
      console.log(list)
    } catch(err) {
      console.log(symbols.error, chalk.red(err.message))
    }
  }

  /**
   * 下载远程模板
   */
  async downloadTemplate(repoUrl) {
    let des = path.resolve(getUserHomeDir(), config.CODE_DEST_URL)
    const spinner = ora('开始下载模板').start()
    try {
      fs.ensureDirSync(des)
      let isSuccess = await repo.getGitCode(repoUrl, des, { clone: false })
      if (isSuccess) {
        spinner.succeed('下载完成').stop()
      }
    } catch(e) {
      spinner.stop()
      console.log(symbols.error, chalk.red('下载模板失败'))
      process.exit(0)
    }
  }

  /**
   * 收集询问
   */
  clollectAsk() {
    this.askProjectName()
    this.askDescription()
    this.askAuthor()
    // this.askSource()
    // this.askTemplate()
    return inquirer.prompt(this._ask)
  }

}

module.exports = Creator
