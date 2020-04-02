echo Building cycle-saver webapp...
# yarn run build
RES= $?
if (( RES -ne 0 ))
    then
        echo ERROR: Failed to build app $?
        exit 1
    else
       echo Finished build
fi
echo Getting ready to deploy to firebase...
firebase deploy
RES= $?
if (( RES -ne 0 ))
    then
        echo ERROR: Failed to deploy $?
        exit 1
    else
        echo Successfully deployed app to firebase
fi
