const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const symbols = require('log-symbols');
const getUserHomeDir = require('./index').getUserHomeDir;
const config = require('../config');

let globalFilePath = path.resolve(getUserHomeDir(), config.HOME_CONFIG_DIR);


const isExistHomeDir = () => {
    return fs.existsSync(getUserHomeDir())
};

const getGlobalConfig = () => {
    if (!isExistHomeDir()) return console.log(symbols.info, '用户目录获取失败');
    if (!fs.existsSync(globalFilePath)) {
        return console.log(symbols.warning, '暂无配置, arc config set <key> <name>进行配置');
    }
    let globalConfig = fs.readJSONSync(globalFilePath);
    console.log(globalConfig)

};

const setGlobalConfig = (key, value) => {
    if (!isExistHomeDir()) return console.log(symbols.info, '用户目录获取失败');
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
};

module.exports = {
    getGlobalConfig,
    setGlobalConfig
};


