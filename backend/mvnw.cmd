@echo off
setlocal

set MAVEN_VERSION=3.9.9
set WRAPPER_BASE=%USERPROFILE%\.m2\wrapper\dists
set MAVEN_HOME=%WRAPPER_BASE%\apache-maven-%MAVEN_VERSION%

if not "%JAVA_HOME%"=="" if not exist "%JAVA_HOME%\bin\java.exe" set "JAVA_HOME="
if "%JAVA_HOME%"=="" if exist "C:\Program Files\Java\latest\bin\java.exe" set "JAVA_HOME=C:\Program Files\Java\latest"
if "%JAVA_HOME%"=="" (
  for /d %%i in ("C:\Program Files\Java\jdk*") do if exist "%%~fi\bin\java.exe" set "JAVA_HOME=%%~fi"
)

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo Downloading Apache Maven %MAVEN_VERSION%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $version='%MAVEN_VERSION%'; $base='%WRAPPER_BASE%'; $url='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/' + $version + '/apache-maven-' + $version + '-bin.zip'; $zip=Join-Path $env:TEMP ('apache-maven-' + $version + '-bin.zip'); New-Item -ItemType Directory -Force -Path $base | Out-Null; Invoke-WebRequest -Uri $url -OutFile $zip; Expand-Archive -LiteralPath $zip -DestinationPath $base -Force"
  if errorlevel 1 exit /b %errorlevel%
)

"%MAVEN_HOME%\bin\mvn.cmd" %*
