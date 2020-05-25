#!/bin/bash

# Debug Mode: ./run_test.sh
# Release Mode: ./run_test.sh release

set -e

if [ $1 = "release" ]; then
    cargo build -p deno_notifs --release
else
    cargo build -p deno_notifs
fi

DENO_NOTIFS_PLUGIN_BASE=./target/debug/ DENO_NOTIFS_DEBUG=true \
deno test --unstable --allow-all tests/test.ts
