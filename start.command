#!/bin/zsh
cd -- "${0:A:h}"
if [[ -x '/Users/emre/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3' ]]; then
  exec '/Users/emre/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3' -m http.server 8765 --bind 127.0.0.1
else
  exec python3 -m http.server 8765 --bind 127.0.0.1
fi
