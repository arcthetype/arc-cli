#! usr/bin/env sh

set -e;
read -p "请输入发布版本: " VERSION;
read -p "确定要发布 $VERSION 版本吗？[y/n]" -n 1;

if [ $REPLY == "y" ] 
then
  echo "\n"
  read -p "是否npm test ? [y/n]" -n 1;
  if [ $REPLY == "y" ]
  then
  npm test
  fi
  npm version $VERSION -m "发布 $VERSION" --allow-same-version;
  npm publish
fi

