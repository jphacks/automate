#!/bin/bash -e

readonly INDENT="    " # 4 spaces

readonly EXITCODE_OK=0
readonly EXITCODE_ERROR=1
readonly EXITCODE_HELP=255

to_stderr() {
	cat 1>&2
}

usage() {
	cat << __EOF
Usage:
${INDENT}\$ $0 <base-repo-path> <init-repo> [organization: jphacks] [protocol: https]

${INDENT}You must set GITHUB_TOKEN as environment variable to use https protocol
__EOF
}

add_remote() {
	local repo=$1
	local org=${2:-jphacks}
	local protocol=${3:-https}
	local url="ssh://git@github.com:${org}/${repo}.git"

	case $protocol in
		https)
			if [ -z "${GITHUB_TOKEN}" ]; then
				echo "GITHUB_TOKEN must be set to use https"
				usage | to_stderr
				exit EXITCODE_ERROR
			fi
			url="https://${GITHUB_TOKEN}@github.com/${org}/${repo}.git"
			;;
		*) echo "Invalid protocol: $protocol" | to_stderr ;;
	esac

	git remote add $repo $url
}

push_init() {
	git push $remote master
}

main() {
	case $1 in
		-h|--help)
			usage | to_stderr
			exit $EXITCODE_HELP
			;;
	esac

	case $# in
		0)
			echo "path to the base repository MUST be specified" | to_stderr
			usage | to_stderr
			exit $EXITCODE_ERROR
			;;
		1)
			echo "repository MUST be specified" | to_stderr
			usage | to_stderr
			exit $EXITCODE_ERROR
			;;
	esac

	local base=$1
	local remote=$2
	local organization=$3
	local protocol=$4

	cd $base
	add_remote $remote $organization $protocol
	push_init $remote

	exit $EXITCODE_OK
}

main $@
