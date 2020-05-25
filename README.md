# deno_notifs

Deno bindings for OS notifications. Currently only supports macos and linux using [notify-rust](https://github.com/hoodie/notify-rust).

## TODO

- Refactor code & Document code
- Provide nicer API with all the options of notify-rust
- Add rust-based integration tests ([like in test_plugin](https://github.com/denoland/deno/blob/master/test_plugin/tests/integration_tests.rs)) & use `Deno.test`
- Make nice README


## Resources & Credits

- Plugin system inspired by [deno_webview](https://github.com/eliassjogreen/deno_webview)
- [GH Issue to check out later](https://github.com/denoland/deno/issues/4222)