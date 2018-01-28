#!/bin/bash

# TODO: I didn't test it:

export USER_NAME=my_name
export GROUP_NAME=$USER_NAME
export WORKING_DIR=/home/my_name/nodejs-prestashop
export SERVICE_NAME=nodejs-prestashop0
export FILE=index.ts

# Detect Debian users running the script with "sh" instead of bash
if readlink /proc/$$/exe | grep -qs "dash"; then
	echo "This script needs to be run with bash, not sh"
	exit 1
fi

if [[ "$EUID" -ne 0 ]]; then
	echo "Sorry, you need to run this as root"
	exit 2
fi

echo "It this good for you?: user/group: $USER_NAME/$GROUP_NAME, service:$SERVICE_NAME, working dir: $WORKING_DIR, server:$FILE"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) echo "creating file"; break;;
        No ) echo "please update the file with correct informations"; exit;;
    esac
done

echo "
[Unit]
Description=$SERVICE_NAME
[Service]
PIDFile=/tmp/nodejs-99.pid
User=$USER_NAME
Group=$GROUP_NAME
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=$WORKING_DIR
ExecStart=$WORKING_DIR/node_modules/.bin/ts-node $FILE
[Install]
WantedBy=multi-user.target
" | sudo tee -a /etc/systemd/system/$SERVICE_NAME.service

sudo systemctl enable $SERVICE_NAME

echo "
# Now you can use the following command:
sudo systemctl stop $SERVICE_NAME.service
sudo systemctl start $SERVICE_NAME.service
sudo journalctl -fu $SERVICE_NAME.service
"