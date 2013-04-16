echo
echo
echo "!!!! ===== Deployment Time ===== !!!!"
echo "!!!! ===== Deployment Time ===== !!!!"
echo
echo "Enter name or IP address of server to deploy. Enter 'production' to deploy to the production parser. Enter 'staging' to deploy to staging. Enter 'cancel' to abort: "
read servers
if [[ $servers =~ ^cancel$ ]]
then
  echo 'Cancelled deployment'
  echo

elif [[ $servers =~ ^production$ ]]
then
  echo 'Deploying to production...'
  for HOST in "sports-xml-parser"
  do
    echo START deploying to $HOST...
    rsync -rvz --delete --exclude=node_modules/ --exclude=deploy.sh * $HOST:/var/ots/tools/mlb-delay-checker/
    ssh $HOST 'cd /var/ots/tools/mlb-delay-checker && npm install'
    echo "NPM packages updated."
    echo FINISHED deploying to $HOST.
  done

elif [[ $servers =~ ^staging$ ]]
then
  HOST="sports-test"
  echo Deploying to $HOST...
  rsync -rvz --delete --exclude=node_modules/ --exclude=deploy.sh * $HOST:/var/ots/tools/mlb-delay-checker/
  echo CACHE CLEARED. Running npm install...
  ssh $HOST 'cd /var/ots/tools/mlb-delay-checker && npm install'
  echo "NPM packages updated."
  echo FINISHED deploying to $HOST.
fi