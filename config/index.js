/**
 * 配置文件常量
 * @type {string}
 */
const HOME_CONFIG_DIR = '.archetype/config.json'

/**
 * 配置时发生的错误定义
 */
const configErrorEnum = {
  'NOT_FOUND_HOME': '用户目录获取失败',
  'NOT_FOUND_CONFIG': '暂无配置, arc config set <key> <name>进行配置',
  'NOT_FOUND_KEY': '没有此配置项',
  'GET_CONFIG_ERROR': '获取配置失败',
  'SET_CONFIG_ERROR': '设置配置失败',
  'DELETE_CONFIG_ERROR': '删除配置失败'
}

/**
 * 下载模板的url
 */
const GIT_REPO_URL_KEY = 'repo'

/**
 * 远程模板的目标目录
 */
const CODE_DEST_URL = '.archetype/remote'

/**
 * 默认的模板源 
 * 托管平台::api_host::组或组织名::private_token
 */
const DEFAULT_TEMPLATE = 'github::https://api.github.com::arcthetype'

/**
 * 用于过滤仓库的子串
 */
const FILTER_GROUP_REPO = 'templates'

module.exports.configErrorEnum = configErrorEnum
module.exports.HOME_CONFIG_DIR = HOME_CONFIG_DIR
module.exports.GIT_REPO_URL_KEY = GIT_REPO_URL_KEY
module.exports.CODE_DEST_URL = CODE_DEST_URL
module.exports.DEFAULT_TEMPLATE = DEFAULT_TEMPLATE
