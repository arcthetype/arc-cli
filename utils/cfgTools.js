const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const symbols = require('log-symbols');
const getUserHomeDir = require('./index').getUserHomeDir;
const isExistHomeDir = require('./index').isExistHomeDir;
const config = require('../config');

let globalFilePath = path.resolve(getUserHomeDir(), config.HOME_CONFIG_DIR);

/**
 * 根据key获取配置信息
 * @param key
 */
const getGlobalConfig = (key, isAll = false) => {
  if (!isExistHomeDir()) return console.log(symbols.info, '用户目录获取失败');
  if (!fs.existsSync(globalFilePath)) return console.log(symbols.warning, '暂无配置, arc config set <key> <name>进行配置');
  try {
    let globalConfig = fs.readJSONSync(globalFilePath);
    if (!isAll) {
      console.log(symbols.success, chalk.green(globalConfig[key]));
    } else {
      console.log(symbols.success, chalk.green(JSON.stringify(globalConfig)));
    }
  } catch (e) {
    console.log(symbols.error, chalk.red('获取配置失败'));
  }
};

/**
 * 设置配置信息
 * @param key
 * @param value
 */
const setGlobalConfig = (key, value) => {
  if (!isExistHomeDir()) return console.log(symbols.info, '用户目录获取失败');
  try {
    if (fs.existsSync(globalFilePath)) {
      let globalConfig = fs.readJSONSync(globalFilePath);
      globalConfig[key] = value;
      fs.writeJSONSync(globalFilePath, globalConfig);
    } else {
      // 确保有配置文件
      fs.ensureFileSync(globalFilePath);
      fs.writeJSONSync(globalFilePath, {
          [key]: value
      })
    }
    console.log(symbols.success, chalk.green('设置配置成功'));
  } catch (e) {
    console.log(symbols.error, chalk.red('配置失败'));
  }
};

/**
 * 根据key删除配置
 * @param key
 */
const flushGlobalConfig = (key, isAll = false) => {
  if (!isExistHomeDir()) return console.log(symbols.info, '用户目录获取失败');
  if (!fs.existsSync(globalFilePath)) return console.log(symbols.error, '还没有进行过配置哦');
  try {
    let globalConfig = fs.readJSONSync(globalFilePath);
    if (!isAll) {
      if (!globalConfig[key]) return console.log(symbols.error, '没有此配置项');
      delete globalConfig[key];
      fs.writeJSONSync(globalFilePath, globalConfig);
    } else {
      fs.unlinkSync(globalFilePath);
    }
    console.log(symbols.success, chalk.green('删除配置成功'));
  } catch (e) {
    console.log(symbols.error, chalk.red('删除配置失败'));
  }
};


module.exports = {
  getGlobalConfig,
  setGlobalConfig,
  flushGlobalConfig
};


