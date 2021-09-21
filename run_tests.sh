#!/bin/bash

# Local Debug Mode: ./run_tests.sh
# Add "release" to build a release version of the rust lib
# Or add "online" to run the tests using the online lib instead
# Example: ./run_tests.sh online

set -e

# Build in release mode if needed
if [[ $1 = "release" ]];  then
    cargo build -p deno_notify --release

    export PLUGIN_URL=./target/release/ 

# Build in debug mode if not release and not online
elif [[ $1 != "online" ]];  then
    cargo build -p deno_notify

    export PLUGIN_URL=./target/debug/
fi

deno test --unstable --allow-all tests/test.ts
