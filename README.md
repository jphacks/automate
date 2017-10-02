# Automation repository

JPHACKS 準備用のスクリプトを保管するリポジトリ

## [prefix-loop.js](./prefix-loop.js)

`JP_YYxx` といった prefix の付いた ID 生成用 js  
今はコマンドとして実装しているけど、require 可能にする予定

```shell
$ node prefix-loop.js [prefix: JP_] [limit: 15] [offset: 1] [zerofill: true]
```

## [mkrepo.js](mkrepo.js)

その名の通りリポジトリを生成するだけの js
これも関数として require 可能にしておきたい

```shell
$ node mkrepo.js <repository> [organization: jphacks]
```

## [push-init.sh](push-init.sh)

mkrepo.js で作成した空リポジトリに既存のリポジトリを push して初期化するスクリプト
js にまとめられると js プログラム一発で全部ができて楽そうだけど、今のところ
cd とか remote の追加とか push とかはコマンドベースで書いたほうが確実なのでシェルスクリプト

```shell
$ push-init.sh <path/to/base/repo> <remote-repository> [organization: jphacks] [protocol: https]
```

## [automate.sh](push-init.sh)

prefix-loop.js, mkrepo.js, push-init.sh を併せてリポジトリを自動作成するようにしたスクリプト  
若干ハードコード気味 :P
