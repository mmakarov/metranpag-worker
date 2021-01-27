#!/bin/sh

INDESIGNSCOUNT="$(ls /Applications | grep InDesign -c)"
if test "$INDESIGNSCOUNT" == "1"; then
    MYWD="$(cd /Applications/*InDesign* ; pwd)"
    APPSCOUNT="$(cd /Applications/*InDesign*; ls | grep .app -c)"

    if test "$APPSCOUNT" == "1"; then
        APPNAME="$(cd /Applications/*InDesign*; ls | grep .app)"
        echo $MYWD"/"$APPNAME
        exit
    fi
    exit
fi
exit
