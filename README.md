# Automation repository

JPHACKS 準備用のスクリプトを保管するリポジトリ

## [prefix-loop.js](./prefix-loop.js)

`JP_YYxx` といった prefix の付いた ID 生成用 js  
今はコマンドとして実装しているけど、require 可能にする予定

```shell
$ node prefix-loop.js [prefix: JP_] [limit: 15] [offset: 1] [zerofill: true]
```

