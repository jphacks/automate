# Automation repository

JPHACKS 準備用のスクリプトを保管するリポジトリ

## [team-and-repo.js](team-and-repo.js)

[Octokit](https://octokit.github.io/rest.js) を使った GitHub の操作スクリプト
チーム名の生成、 チームの作成、リポジトリの作成、リポジトリへの push 権限の付与を一括で実行

## [push-init.sh](push-init.sh)

mkrepo.js で作成した空リポジトリに既存のリポジトリを push して初期化するスクリプト
js にまとめられると js プログラム一発で全部ができて楽そうだけど、今のところ
cd とか remote の追加とか push とかはコマンドベースで書いたほうが確実なのでシェルスクリプト

```shell
$ push-init.sh <path/to/base/repo> <remote-repository> [organization: jphacks] [protocol: https]
```
