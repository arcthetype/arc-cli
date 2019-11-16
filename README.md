<p align="center">
  <img src="https://avatars1.githubusercontent.com/u/57614327?s=200&v=4" width="150" height="150"/></p>
<p align="center">
  <img src="https://www.travis-ci.org/arcthetype/arc-cli.svg?branch=master" />
  <img src="https://scrutinizer-ci.com/g/arcthetype/arc-cli/badges/quality-score.png?b=master" />
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/arcthetype/arc-cli" />
  <img src="https://img.shields.io/badge/node-%3E%3D7.6.0-brightgreen" />
  <img alt="GitHub" src="https://img.shields.io/github/license/arcthetype/arc-cli" />
</p>

### 快速搭建项目的工具

- [x] 支持github以组织的形式维护模板， 仓库名以-project或-template为后缀
- [x] 支持gitlab以组的形式维护模板，仓库名以-project或-template为后缀
- [ ] 项目中不包含本地模板，将提供默认模板与[github](https://github.com/arcthetype)
- [ ] 暂不支持打包，构建等
- [ ] 。。。

### 安装
```shell
npm i -g arc-tool
```

### 支持以下命令

```shell
# 根据key值查询配置
arc config get <key>
# 设置配置
arc config set <key> <value>
# 以json格式展示所有配置
arc config ls
# 根据key值删除配置
arc config flush <key>
# 清空配置
arc config flushall

# 创建项目
arc create [projectName]

# 配置自己的模板源
# github  [托管平台]::[api地址]::[组织名]
arc config set repo github::https://api.github.com::arcthetype
# gitlab [托管平台]::[api地址]::[组名]::[private_token]
arc config set repo gitlab::[公司或个人的gitlab域名]::arcthetype::[private_token]
```



MIT License

Copyright (c) 2019 HRD
