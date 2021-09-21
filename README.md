# deno_notify

[![license](https://img.shields.io/github/license/Pandawan/deno_notify)](https://github.com/Pandawan/deno_notify/blob/master/LICENSE)
[![build](https://img.shields.io/github/workflow/status/Pandawan/deno_notify/Build)](https://github.com/Pandawan/deno_notify/actions)
[![deno version](https://img.shields.io/badge/deno-1.15.0-success)](https://github.com/denoland/deno)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/deno_notify/ts/mod.ts)

Send desktop notifications on all platforms in Deno.  
Supports Windows, macOS, and linux using [notify-rust](https://github.com/hoodie/notify-rust) though some features are platform-specific.

Note: More features are in the works and the API may change as a result.

## Usage

The `mod.ts` entrypoint uses [Plug](https://github.com/denosaurs/plug) internally so you don't have to download or open the plugin manually.

_You will need to run using the `--unstable` and `--allow-all` permissions to allow for automatic plugin loading and caching._

```ts
import { Notification } from "https://deno.land/x/deno_notify@1.0.0/ts/mod.ts";

// Create a new notification
const notif = new Notification();

// Add a simple message
notif.title('My message');

// Display it
notif.show();
```

### Platform-Specific Features

By default, only cross-platform features are available. In order to enable platform-specific features (e.g. icons), you can pass in booleans to specify the supported platforms in the `Notification`'s constructor.

```ts
const notif = new Notification({ linux: true });

// Notification.icon() is now available
notif.icon('/path/to/icon');
```

Specifying platforms may also provide different documentation and typings for the `Notification` API.

```ts
const notif = new Notification({ macos: true });

// On macOS, a list of accepted sound names are given in the parameter type.
notif.soundName('Basso');
```

#### Strict Platform Checking

The second parameter of the `Notification`'s constructor can be used to determine whether the platform-features should be checked at runtime. When `true` (default), any platform-specific feature will error if used on a platform that does not support it. When `false`, the error will be silently ignored.

Note: Platform checking is performed both at compile time (TypeScript) and at runtime.

```ts
// If notif.icon() is called on a macOS computer, this will error.
const notif = new Notification({ linux: true }, true);
notif.icon('/path/to/icon');

// This will not error; However, no icon will be displayed.
const notif = new Notification({ linux: true }, false);
notif.icon('/path/to/icon');
```

## TODO

- Integrate my mac-notification-sys changes into notify-rust so I can add more cross-platform features.
- Find a way to test in GH actions for Linux & Windows
- Find out why Windows notifications only appear in action center

## Known Issues

- Many platform-specific features are not implemented
  - Features like actions, subtitle, hints, etc.
- Custom app icons are only applied if the notification requesting it is the first one being sent on mac
  - This means an app icon cannot be changed once set, and cannot be changed even if it wasn't set in the first one.
- Using a custom app icon on mac sometimes crashes
  - From my own experience, this seems to happen with non-default applications.
  - [See this GitHub issue for more information](https://github.com/h4llow3En/mac-notification-sys/issues/8)

## Resources & Credits

- Notification system from [notify-rust](https://github.com/hoodie/notify-rust)
- Plugin import from [deno-plugin-prepare](https://github.com/manyuanrong/deno-plugin-prepare)
- Plugin system inspired by [deno_webview](https://github.com/eliassjogreen/deno_webview) and [deno_sqlite_plugin](https://github.com/crabmusket/deno_sqlite_plugin)
- [GH Issue to check out later](https://github.com/denoland/deno/issues/4222)
