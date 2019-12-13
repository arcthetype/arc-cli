const inquirer = require('inquirer')
const symbols = require('log-symbols')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const semver = require('semver')
const ora = require('ora')
const ejs = require('ejs')
const util = require('util')
const exec = require('child_process').exec
const repo = require('../../utils/repository')
const { CODE_DEST_URL } = require('../../config')
const { getUserHomeDir, gitIsIntalled, npmIsInstalled } = require('../../utils')

const shell = util.promisify(exec)

/**
 * 创建工程的类
 */
class Creator {
  constructor({ name, description, author, root }) {
    const unSupportedVer = semver.lt(process.version, 'v7.6.0')
    if (unSupportedVer) {
      throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+')
    }
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
     * 用于询问的列表
     * @type {Array}
     * @private
     */
    this._ask = [],
    /**
     * 远程模板临时下载目录
     */
    this._dest = path.resolve(getUserHomeDir(), CODE_DEST_URL)
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
  askTemplate(list) {
    return inquirer.prompt([{
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: list
    }])
  }

  /**
   * 创建
   */
  async create() {
    try {
      const { projectName, description, author } =  await this.clollectAsk()
      typeof projectName !== 'undefined' && (this._name = projectName)
      typeof description !== 'undefined' && (this._description = description)
      typeof author !== 'undefined' && (this._author = author)
      let result = await repo.getTemplatesList()
      const { template } = await this.askTemplate(result.list)
      let dest = await repo.downloadTemplate(template, result.info, this)
      let npmPkgOld = path.join(dest, 'package.json')
      let npmPkgNew = await ejs.renderFile(npmPkgOld, {
        projectName: this._name,
        description: this._description,
        author: this._author
      })
      fs.writeFileSync(npmPkgOld, npmPkgNew, 'utf8')
      let copyDest = path.join(this._root, this._name)
      fs.ensureDirSync(copyDest)
      fs.copySync(dest, copyDest)
      fs.removeSync(this._dest)
      // const { stderr } = await shell(`cd ${copyDest} & git init`)
      // if (stderr) throw new Error(`执行cd ${copyDest} 失败`)
      process.chdir(copyDest)
      if (gitIsIntalled()) {
        const spinner = ora('初始化项目中...').start()
        await shell('git init')
        spinner.succeed('初始化成功').stop()
        console.log(`
          $ ${chalk.green('cd ' + this._name)}
          $ ${chalk.green('npm install\n')}
          `
        )
      }
      process.exit(0)
    } catch(err) {
      console.log(symbols.error, chalk.red(err.message))
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
    return inquirer.prompt(this._ask)
  }

}

module.exports = Creator
