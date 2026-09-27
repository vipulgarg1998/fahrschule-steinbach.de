#!/usr/bin/env sh
set -eu

SCRIPT_DIRECTORY=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$SCRIPT_DIRECTORY"

echo "Preview: http://localhost:4173"
echo "Save schedule.csv and refresh the browser to see changes."
echo "Press Ctrl+C to stop the preview server."
python3 -m http.server 4173
