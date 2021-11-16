@echo off

setlocal
set WORKDIR=%cd%

if exist .first_run (
    set /p TYPECLONE=<.first_run
) else (
    set /p TYPECLONE="Choose the cloning method: type ssh or https and press Enter: "
	echo %TYPECLONE%
)

if %TYPECLONE%==ssh (
	echo ssh > .first_run
) else if %TYPECLONE%==https (
	echo https > .first_run
) else (
	echo Wrong type! Try relaunch. Exit...
	exit /b
)

call :type_clone %TYPECLONE%

IF "%1"=="" GOTO noArgs

if "%1%"=="--clean" (
	echo Starting a clean launch...
	GOTO clean_launch
)

:noArgs
	echo No params, use normal startup
	echo If you want a 'clean launch', use --clean as an argument; it removes all data and restarts all applications.
goto :run_compose

:type_clone
	if %~1==ssh (
		set WR=git@github.com:SoftwareCountry/WhiteRabbit.git
		set CDMB=git@github.com:SoftwareCountry/ETL-CDMBuilder.git
		set DQC=git@github.com:SoftwareCountry/DataQualityDashboard.git
		) else (
		set WR=https://github.com/SoftwareCountry/WhiteRabbit.git
		set CDMB=https://github.com/SoftwareCountry/ETL-CDMBuilder.git
		set DQC=https://github.com/SoftwareCountry/DataQualityDashboard.git
	)
goto :eof

:clean_launch 
	docker-compose down
	docker volume rm -f perseus_perseusdb
	RD /S /Q ..\WhiteRabbit ..\DataQualityDashboard ..\ETL-CDMBuilder

:run_compose

	cd %WORKDIR%\..
	if exist WhiteRabbit\ (
		call :git_pull WhiteRabbit
	) else (
		call :git_clone WhiteRabbit
	)
	if exist ETL-CDMBuilder\ (
		call :git_pull CDMBuilder
	) else (
		call :git_clone CDMBuilder
	)
	if exist DataQualityDashboard\ (
		call :git_pull DataQualityDashboard
	) else (
		call :git_clone DataQualityDashboard
	)
	cd %WORKDIR%
	docker-compose build
	docker-compose up -d
goto :eof
	
:git_pull
	if %~1==WhiteRabbit (
		pushd .
		cd WhiteRabbit\
		git pull
		popd
	) else if %~1==CDMBuilder (
		pushd .
		cd ETL-CDMBuilder\
		git pull
		popd
	) else if %~1==DataQualityDashboard (
		pushd .
		cd DataQualityDashboard\
		git pull
		popd
	)
goto :eof

:git_clone
	if %~1==WhiteRabbit (
		git clone %WR%
	) else if %~1==CDMBuilder (
		git clone %CDMB%
	) else if %~1==DataQualityDashboard (
		git clone %DQC%
	)
goto :eof

endlocal