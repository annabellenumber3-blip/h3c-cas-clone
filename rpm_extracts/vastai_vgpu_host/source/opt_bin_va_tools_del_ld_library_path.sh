#!/bin/bash

if cat /etc/vastai_tools.env |grep "LD_LIBRARY_PATH" > /dev/null
then
sed -i '$a\export LD_LIBRARY_PATH=' /etc/vastai_tools.env
fi

source /etc/profile
echo "LD_LIBRARY_PATH has been removed."
