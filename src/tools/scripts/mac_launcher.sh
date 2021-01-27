echo "tell application \"${13}\"
set js to \"#include $1;\" & return
set js to js & \"main($2, $3, $4, $5, $6, $7, $8, $9, ${10}, ${11}, ${12}, ${14});\" & return
do script js language javascript
end tell
"

osascript -e "tell application \"${13}\"
set js to \"#include $1;\" & return
set js to js & \"main('$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9', '${10}', '${11}', '${12}', '${14}');\" & return
do script js language javascript
end tell
"