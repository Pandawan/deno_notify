# deno_notify

Send desktop notifications on all platforms in Deno.  
Supports Windows, macOS, and linux using [notify-rust](https://github.com/hoodie/notify-rust) though some features are platform-specific.

Note: More features are in the works and the API may change as a result, but the module can already be considered as working.

*Supports Deno v1.0.0 and higher.*

## Important

Because the plug-in API of Deno is still in an unstable state, the `--unstable` flag needs to be used. The minimum permissions required to run `deno_notify` should be

```sh
# With prepared.ts (these extra permissions are required for downloading and caching the plugin)
deno run --unstable --allow-plugin --allow-read --allow-write --allow-net xxx.ts

# With manual plugin loading (mod.ts)
deno run --unstable --allow-plugin xxx.ts
```

## Usage

A `prepared.ts` entrypoint is provided which uses [deno-plugin-prepare](https://github.com/manyuanrong/deno-plugin-prepare) internally so you don't have to download or open the plugin manually.

```ts
import { notify } from 'https://deno.land/x/deno_notify@0.2.0/ts/prepared.ts';

// Pass a simple message string
notify('Message');

// Pass an options object (See mod.ts's INotification)
notify({
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
Make sure you [download](https://github.com/PandawanFr/deno_notify/releases/tag/0.2.0) the correct plugin for your operating system.

```ts
import { notify } from 'https://deno.land/x/deno_notify@0.2.0/ts/mod.ts';

// Load the plugin manually
Deno.openPlugin("./libdeno_notify.dylib");

// Use notify the same way you would with the prepared import
notify({ title: 'Hello', message: 'World' });
```

## TODO

- Find a way to test in GH actions for Linux & Windows
- Find out why Windows notifications only appear in action center
- Separate API into platform-specific files (one for each platform) so TS api is nicer
  - And export a cross-platform version that allows only cross-platform options
  - This means TS api never lies to you, if you want cross platform you only get a subset, but if you want specific platforms to work differently, you can have your own if/else logic based on the platform you care about.
  - On the rust side, I could also have separating logic like notify-rust to enable for more macOS-specific code (such as delivery_date which is not available in notify-rust but is available in mac-notification-sys).

## Known Issues

- Many platform-specific features are not implemented
  - I need to figure out a good way to handle platform-specific features while retaining easy to use and understand typings/documentation.
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
