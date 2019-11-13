const request = require('request')
const download = require('download-git-repo')
const symbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { DEFAULT_TEMPLATE, GIT_REPO_URL_KEY } = require('../config')
const cfg = require('../utils/cfg-tools')

/**
 * 解析<repo>配置信息
 * @param {*} repoValue 
 */
const parseTemplateDlInfo = (repoValue) => {
  if (!repoValue) return
  return {
    api: repoValue.split('::')[1],
    groupName: repoValue.split('::')[2],
    gitType: repoValue.split('::')[0],
    privateToken: repoValue.split('::')[3]
  }
}

/**
 * 请求方法
 * @param {*} param0 
 */
const fetch = ({ url, method = 'GET', loadingInfo, headers }) => {
  return new Promise((resolve, reject) => {
    let spinner = null
    loadingInfo && (spinner = ora(loadingInfo).start())
    request({
      url,
      method,
      json: true,
      headers: Object.assign({}, { "content-type": "application/json", 'User-Agent': 'arcthetype' }, headers)
    }, 
    (error, response, body) => {
      spinner && spinner.stop()
      if (error) reject(error)
      resolve(body)
    })
  })
}

/**
 * 获取代码
 * @param {*} repo 
 * @param {*} des 
 * @param {*} opts 
 */
const getGitCode = (repo, des, opts) => {
  return new Promise((resolve, reject) => {
    let defaults = {
      clone: false
    }
    let options = Object.assign({}, defaults, opts)
    download(repo, des, options, err => {
      if (err) reject(err)
      resolve(true)
    })
  })
}

/**
 * 获取模板列表
 */
const getTemplatesList = () => {
  return new Promise(async (resolve, reject) => {
    cfg.getGlobalConfig(GIT_REPO_URL_KEY).then(repoValue => {
      let info = parseTemplateDlInfo(repoValue ? repoValue : DEFAULT_TEMPLATE)
      let params = {
        url: info.gitType === 'github' ? `${info.api}/orgs/${info.groupName}/repos` : `${info.api}/api/v4/groups/${info.groupName}`,
        loadingInfo: '正在获取模板列表...'
      }
      if (info.gitType === 'gitlab') {
        params.headers = {
          'Private-Token': info.privateToken
        }
      }
      fetch(params).then(result => {
        result && resolve(result)
      })
    }).catch(() => {
      reject(new Error('获取模板列表失败'))
    })
  })
}

module.exports = {
  getGitCode,
  getTemplatesList
}
