const pkg = require('../package.json');
const chalk = require('chalk');
const os = require('os');

const getPkgVersion = () => {
  return pkg.version
};

const printPkgVersion = () => {
  let version = getPkgVersion();
  console.log(chalk.green(`archetype version is ${version}`));
};

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

const getUserHomeDir  = () => {
  return typeof os.homedir === 'function' ? os.homedir() : homedir()
};

module.exports = {
  getPkgVersion,
  printPkgVersion,
  getUserHomeDir
};
