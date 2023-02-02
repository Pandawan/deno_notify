#!/bin/bash

# Local Debug Mode: ./run_tests.sh
# Add "release" to build a release version of the rust lib
# Or add "online" to run the tests using the online lib instead
# Example: ./run_tests.sh online

set -e

is_local=true

# Build in release mode if needed
if [ "$1" = "release" ];  then
    cargo build -p deno_notify --release

    export NOTIFY_PLUGIN_URL=./target/release

# Build in debug mode if not release and not online
elif [ "$1" != "online" ];  then
    cargo build -p deno_notify

    is_local=false

    export NOTIFY_PLUGIN_URL=./target/debug
fi

# Rename to the architecture-specific name of the library
if [ "$is_local" = true ] && [ "$OSTYPE" = "darwin"* ]; then
    arch=$(uname -m)
    if [ "$arch" == "arm64" ]; then
        arch="aarch64"
    fi

    cp $NOTIFY_PLUGIN_URL/libdeno_notify.dylib $NOTIFY_PLUGIN_URL/libdeno_notify.$arch.dylib
fi

deno test --unstable --allow-all tests/*.ts
