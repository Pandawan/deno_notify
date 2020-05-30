#!/bin/bash

# Debug Mode: ./run_test.sh
# Release Mode: ./run_test.sh release

set -e

if [[ $1 = "release" ]]; then
    cargo build -p deno_notify --release
else
    cargo build -p deno_notify
fi

DENO_NOTIFY_PLUGIN_BASE=./target/debug/ DENO_NOTIFY_DEBUG=true \
deno test --unstable --allow-all tests/test.ts
