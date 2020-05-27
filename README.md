# deno_notifs

Deno bindings for OS notifications. Currently only supports macos and linux using [notify-rust](https://github.com/hoodie/notify-rust).

## TODO

- Make "prepare" logic optional (with a separate prepared.ts import)
- Provide nicer API with all the options of notify-rust
- Make nice README

## Known Issues

- Many platform-specific features are not implemented
  - I need to figure out a good way to handle platform-specific features while retaining easy to use and understand typings/documentation.
  - Features like actions, subtitle, hints, etc.
- Using a custom app icon on mac sometimes crashes
  - From my own experience, this seems to happen with non-default applications.
  - [See this GitHub issue for more information](https://github.com/h4llow3En/mac-notification-sys/issues/8)

## Resources & Credits

- Notification system from [notify-rust](https://github.com/hoodie/notify-rust)
- Plugin system inspired by [deno_webview](https://github.com/eliassjogreen/deno_webview)
- [GH Issue to check out later](https://github.com/denoland/deno/issues/4222)
