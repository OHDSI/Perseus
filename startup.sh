#!/bin/bash

WORKDIR=$(pwd)

function type_clone {
	case "$TYPECLONE" in
		ssh)	WR="git@github.com:SoftwareCountry/WhiteRabbit.git";
			CDMB="git@github.com:SoftwareCountry/ETL-CDMBuilder.git";
			DQC="git@github.com:SoftwareCountry/DataQualityDashboard.git" ;;
		https)	WR="https://github.com/SoftwareCountry/WhiteRabbit.git";
			CDMB="https://github.com/SoftwareCountry/ETL-CDMBuilder.git";
			DQC="https://github.com/SoftwareCountry/DataQualityDashboard.git" ;;
	esac
}

if [[ ! -f .first_run ]]; then
	echo -e "Choose the cloning method: type \033[33mssh \033[0mor \033[33mhttps\033[0m:"
	read TYPECLONE
	case "$TYPECLONE" in
		ssh)	echo -n "ssh" > .first_run ;;
		https)	echo -n "https" > .first_run ;;
		*)	echo "Wrong type! Try relaunch. Exit..."; exit 1 ;;
	esac
else
	TYPECLONE=$(cat .first_run)
fi
type_clone "$TYPECLONE"

function git_clone {
	case "$1" in
		WhiteRabbit)		git clone "$WR" ;;
		CDMBuilder)		git clone "$CDMB" ;;
		DataQualityDashboard)	git clone "$DQC";;
	esac
}

function git_pull {
	case "$1" in
		WhiteRabbit)		cd WhiteRabbit; git pull; cd - ;;
		CDMBuilder)		cd ETL-CDMBuilder; git pull; cd - ;;
		DataQualityDashboard)	cd DataQualityDashboard; git pull; cd - ;;
	esac
}

function check_dirs {
	cd "$WORKDIR"/..
	if [[ ! -d "WhiteRabbit" ]]; then
		git_clone "WhiteRabbit"
	else
		git_pull "WhiteRabbit"
	fi
	if [[ ! -d "ETL-CDMBuilder" ]]; then
		git_clone "CDMBuilder"
	else
		git_pull "CDMBuilder"
	fi
	if [[ ! -d "DataQualityDashboard" ]]; then
		git_clone "DataQualityDashboard"
	else
		git_pull "DataQualityDashboard"
	fi
	cd "$WORKDIR"
}

function clean_launch {
	docker compose down;
	docker volume rm -f perseus_perseusdb;
	rm -rf ../WhiteRabbit ../DataQualityDashboard ../ETL-CDMBuilder;
}

if [[ "$#" -ne 1 ]]; then
	echo -e "No params, use normal startup\nIf you want a 'clean launch', use --clean as an argument; it removes all data and restarts all applications."
fi

if [[ "$1" == "--clean" ]]; then
	echo "Starting a clean launch..."
	clean_launch;
fi

check_dirs;
docker compose build
docker compose up -d

exit 0
