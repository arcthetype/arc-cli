const download = require('download-git-repo')
const symbols = require('log-symbols')
const chalk = require('chalk')

const getGitCode = (repo, des, opts) => {
  return new Promise((resolve, reject) => {
    let defaults = {
      clone: false
    }
    let options = Object.assign({}, defaults, opts)
    download(repo, des, options, err => {
      if (!err) reject(err)
      resolve(true)
    })
  })
}

module.exports = {
  getGitCode
}
