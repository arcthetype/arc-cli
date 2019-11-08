const pkg = require('../package.json');
const chalk = require('chalk');
const os = require('os');
const fs = require('fs-extra');

/**
 * 获取版本号
 */
const getPkgVersion = () => {
  return pkg.version
};

/**
 * 获取用户主目录
 * @returns {*|string|string|*|string}
 */
const homedir = () => {
  const env = process.env
  const home = env.HOME
  const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME

  if (process.platform === 'win32') {
    return env.USERPROFILE || '' + env.HOMEDRIVE + env.HOMEPATH || home || ''
  }

  if (process.platform === 'darwin') {
    return home || (user ? '/Users/' + user : '')
  }

  if (process.platform === 'linux') {
    return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : ''))
  }

  return home || ''
};

/**
 * 获取用户主目录
 * @returns {*|string}
 */
const getUserHomeDir  = () => {
  return typeof os.homedir === 'function' ? os.homedir() : homedir()
};

/**
 * 判断是否存在主目录
 * @returns {*}
 */
const isExistHomeDir = () => {
  return fs.existsSync(getUserHomeDir())
};

module.exports = {
  getPkgVersion,
  getUserHomeDir,
  isExistHomeDir
};
