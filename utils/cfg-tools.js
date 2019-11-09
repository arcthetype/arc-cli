const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const symbols = require('log-symbols')
const getUserHomeDir = require('./index').getUserHomeDir
const isExistHomeDir = require('./index').isExistHomeDir
const HOME_CONFIG_DIR = require('../config').HOME_CONFIG_DIR
const configErrorEnum = require('../config').configErrorEnum

let globalFilePath = path.resolve(getUserHomeDir(), HOME_CONFIG_DIR)

/**
 * 根据key获取配置信息
 * @param key
 */
const getGlobalConfig = (key, isAll = false) => {
  return new Promise((resolve, reject) => {
    try {
      if (!isExistHomeDir()) reject(new Error(configErrorEnum.NOT_FOUND_HOME))
      if (!fs.existsSync(globalFilePath)) reject(new Error(configErrorEnum.NOT_FOUND_CONFIG))
      let globalConfig = fs.readJSONSync(globalFilePath)
      if (!isAll) {
        resolve(globalConfig[key])
      } else {
        resolve(globalConfig)
      }
    } catch (e) {
      reject(new Error(configErrorEnum.GET_CONFIG_ERROR))
    }
  })
}

/**
 * 设置配置信息
 * @param key
 * @param value
 */
const setGlobalConfig = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (!isExistHomeDir()) reject(new Error(configErrorEnum.NOT_FOUND_HOME))
      if (fs.existsSync(globalFilePath)) {
        let globalConfig = fs.readJSONSync(globalFilePath)
        globalConfig[key] = value
        fs.writeJSONSync(globalFilePath, globalConfig)
      } else {
        // 确保有配置文件
        fs.ensureFileSync(globalFilePath)
        fs.writeJSONSync(globalFilePath, {
            [key]: value
        })
      }
      resolve()
    } catch (e) {
      reject(new Error(configErrorEnum.SET_CONFIG_ERROR))
    }
  })
}

/**
 * 根据key删除配置
 * @param key
 */
const flushGlobalConfig = (key, isAll = false) => {
  return new Promise((resolve, reject) => {
    try {
      if (!isExistHomeDir()) reject(new Error(configErrorEnum.NOT_FOUND_HOME))
      if (!fs.existsSync(globalFilePath)) reject(new Error(new Error(configErrorEnum.NOT_FOUND_CONFIG)))
      let globalConfig = fs.readJSONSync(globalFilePath)
      if (!isAll) {
        if (!globalConfig[key]) return reject(new Error(configErrorEnum.NOT_FOUND_KEY))
        delete globalConfig[key]
        fs.writeJSONSync(globalFilePath, globalConfig)
      } else {
        fs.unlinkSync(globalFilePath)
      }
      resolve()
    } catch (e) {
      reject(new Error(configErrorEnum.DELETE_CONFIG_ERROR))
    }
  })
}

module.exports = {
  getGlobalConfig,
  setGlobalConfig,
  flushGlobalConfig
}
