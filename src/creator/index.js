const inquirer = require('inquirer');
const fs = require('fs');

/**
 * 创建工程的类
 */
class Creator {

  constructor({ name, description, author, template }) {
    /**
     * 项目名称
     * @type {String}
     * @private
     */
    this._name = name;
    /**
     * 项目描述
     * @type {String}
     * @private
     */
    this._description = description;
    /**
     * 作者
     * @type {String}
     * @private
     */
    this._author = author;
    /**
     * 模板类型
     * @type {String}
     * @private
     */
    this._template = template;
    /**
     * 用于询问的列表
     * @type {Array}
     * @private
     */
    this._ask = [];
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
            return '项目名不能为空！';
          }
          if (fs.existsSync(input)) {
            return '已经存在同名项目，请换一个项目名！';
          }
          _this._name = input;
          return true;
        }
      })
    } else if (fs.existsSync(this._name)) {
      this._ask.push({
        type: 'input',
        name: 'projectName',
        message: '已经存在同名项目，请换一个项目名',
        validate(input) {
          if (!input) {
            return '项目名不能为空！';
          }
          if (fs.existsSync(input)) {
            return '依旧重复，请再换一个项目名！';
          }
          _this._name = input;
          return true;
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
  askTemplate() {
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
    ];
    this._ask.push({
      type: 'list',
      name: 'template',
      message: '请选择项目类型(vue/vue-admin/weapp)',
      choices: typeChoices
    })
  }

  /**
   * 询问模板源
   */
  askSource() {
    const typeChoices = ['default', 'remote'];
    this._ask.push({
      type: 'list',
      name: 'templateSources',
      message: '请选择模板源',
      choices: typeChoices
    })
  }

  /**
   * 创建
   */
  create() {
    this.clollectAsk().then(res => {

    })
  }

  /**
   * 收集询问
   */
  clollectAsk() {
    this.askProjectName();
    this.askDescription();
    this.askAuthor();
    this.askTemplate();
    this.askSource();
    return inquirer.prompt(this._ask);
  }

}

module.exports = Creator;