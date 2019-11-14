const request = require('request')
const path = require('path')
const fs = require('fs-extra')
const util = require('util')
const rmraf = require('rimraf')
const downloadUrl = require('download')
const symbols = require('log-symbols')
const chalk = require('chalk')
const ora = require('ora')
const { DEFAULT_TEMPLATE, GIT_REPO_URL_KEY, CODE_DEST_URL } = require('../config')
const cfg = require('../utils/cfg-tools')
const { getUserHomeDir } = require('../utils')

const rmrafAsync = util.promisify(rmraf)

/**
 * 解析<repo>配置信息
 * @param {仓库的配置信息} repoValue 
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
 * 
 * @param {托管平台类型} gitType 
 */
const composeTemplate = (gitType, list) => {
  let result = []
  if (gitType == 'github') {
    result = list.map(item => ({
      name: item.name,
      value: `${ item.html_url }/archive/master.zip`
    }))
  } else {
    result = list.projects.map(item => ({
      name: item.name, 
      value: `${item.web_url}/-/archive/master/${item.name}-master.zip`
    }))
  }
  return result.filter(item => item.name.search(/project|template/) > -1)
}

/**
 * 请求方法
 * @param {url, method, loadingInfo, headers} param0 
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
      response && response.statusCode === 200 && resolve(body)
    })
  })
}

/**
 * 获取代码
 * @param {仓库} repo 
 * @param {下载的临时路径} des 
 * @param {配置} opts 
 */
const getGitCode = (repo, des, opts) => {
  return new Promise((resolve, reject) => {
    let downloadOptions = {
      extract: true,
      strip: 1,
      mode: '666',
      ...opts,
      headers: {
        accept: 'application/zip',
        ...(opts.headers || {})
      }
    }
    downloadUrl(repo, des, downloadOptions).then(() => {
      resolve(true)
    }).catch(err => {
      reject(err)
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
        if (result) {
          resolve({ list: composeTemplate(info.gitType, result), info })
        }
      })
    }).catch(() => {
      reject(new Error('获取模板列表失败'))
    })
  })
}

/**
 * 下载远程模板
 */
const downloadTemplate = (repoUrl, info, creator) => {
  return new Promise(async (resolve, reject) => {
    let des = path.join(creator._dest, creator.name)
    const spinner = ora('开始下载模板...').start()
    try {
      let params = {}
      info.gitType === 'gitlab' && (params.headers = { 'PRIVATE-TOKEN': info.privateToken })
      fs.ensureDirSync(des)
      let isSuccess = await getGitCode(repoUrl, des, params)
      if (isSuccess) {
        spinner.succeed().stop()
        resolve(des)
      }
    } catch(e) {
      spinner.stop()
      console.log(symbols.error, chalk.red('下载模板失败'))
      process.exit(0)
    }
  })
}

module.exports = {
  getGitCode,
  getTemplatesList,
  downloadTemplate
}
