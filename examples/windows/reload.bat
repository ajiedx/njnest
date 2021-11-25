@echo off

if exist %USERPROFILE%\AppData\Local\Microsoft\WindowsApps\wt.exe goto :startwt

:startwt
	%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\wt.exe -w Group nt --title "NJNEST" --tabColor #3d6120 node srv.js
	
	exit