#!/bin/zsh

pid=$(pgrep -f 'offline start');
my_array=($(echo $pid | tr " " "\n"))
killed=0
for i in "${my_array[@]}"
do
    kill $i
    killed=`expr $killed + 1`;
done
echo "Killed $killed Serverless Offline Processes."

pid=$(pgrep -f 'dynamo');
my_array=($(echo $pid | tr " " "\n"))
killed=0
for i in "${my_array[@]}"
do
    kill $i
    killed=`expr $killed + 1`;
done

echo "Killed $killed DynamoDB Processes."