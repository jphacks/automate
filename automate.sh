#!/usr/bin/env bash

readonly ORGANIZATION="jphacks"
readonly BASEREPO_PATH="~/github.com/jphacks/sample"

prepare() {
	local prefix=$1
	local limit=$2
	local offset=$3

	node prefix-loop.js $prefix $limit $offset | xargs -n1 -I@ \
		node mkrepo.js @ $ORGANIZATION
	node prefix-loop.js $prefix $limit $offset | xargs -n1 -I@ \
		bash push-init.sh $BASEREPO_PATH @ $ORGANIZATION
}
: "2017 札幌" || {
	prepare SP_17 15 1
}

: "2017 仙台" || {
	prepare SD_17 15 1
}

: "2017 名古屋" || {
	prepare NG_17 15 1
}

: "2017 神戸" || {
	prepare KB_17 15 1
}

: "2017 福岡" || {
	prepare FK_17 15 1
}

: "2017 東京" || {
	prepare TK_17 30 1
}
