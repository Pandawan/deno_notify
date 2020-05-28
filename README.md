# deno_notifs

Deno bindings for OS notifications.  
Supports Windows, macOS, and linux using [notify-rust](https://github.com/hoodie/notify-rust) though some features are platform-specific.

## Usage

A `prepared.ts` entrypoint is provided which uses [deno-plugin-prepare](https://github.com/manyuanrong/deno-plugin-prepare) internally so you don't have to download or open the plugin manually.

```ts
import { notify } from 'https://denopkg.com/PandawanFr/deno_notifs@0.1.0/ts/prepared.ts';

// String
await notify('Message');

// Object
await notify({
  title: 'Hello',
  message: 'World',
  icon: {
    app: "Terminal",
  },
  sound: "Basso",
});
```

### Manual Loading

If you prefer to handle the plugin loading manually, you can do so by using the `mod.ts` entrypoint.
Make sure you [download](https://github.com/PandawanFr/deno_notifs/releases/tag/0.1.0) the correct plugin for your operating system.

```ts
import { notify } from 'https://denopkg.com/PandawanFr/deno_notifs@0.1.0/ts/mod.ts';

// Load the plugin manually
Deno.openPlugin("./libdeno_notifs.dylib");

// Use notify the same way you would with the prepared import
await notify({ title: 'Hello', message: 'World' });
```

## TODO

- Separate API into platform-specific files (one for each platform) so TS api is nicer
  - And export a cross-platform version that allows only cross-platform options
  - This means TS api never lies to you, if you want cross platform you only get a subset, but if you want specific platforms to work differently, you can have your own if/else logic based on the platform you care about.

## Known Issues

- Many platform-specific features are not implemented
  - I need to figure out a good way to handle platform-specific features while retaining easy to use and understand typings/documentation.
  - Features like actions, subtitle, hints, etc.
- Custom app icons are only applied if the notification requesting it is the first one being sent on mac
- Using a custom app icon on mac sometimes crashes
  - From my own experience, this seems to happen with non-default applications.
  - [See this GitHub issue for more information](https://github.com/h4llow3En/mac-notification-sys/issues/8)

## Resources & Credits

- Notification system from [notify-rust](https://github.com/hoodie/notify-rust)
- Plugin import from [deno-plugin-prepare](https://github.com/manyuanrong/deno-plugin-prepare)
- Plugin system inspired by [deno_webview](https://github.com/eliassjogreen/deno_webview) and [deno_sqlite_plugin](https://github.com/crabmusket/deno_sqlite_plugin)
- [GH Issue to check out later](https://github.com/denoland/deno/issues/4222)
