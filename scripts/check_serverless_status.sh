#!/bin/zsh

processes=$(ps a | grep 'offline start' | grep -v 'grep')
processes=${#processes};
if [ $processes -lt 1 ]; then
    nohup sls offline start &
fi