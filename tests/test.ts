// Run test with DENO_NOTIFS_PLUGIN_BASE=./target/debug/ DENO_NOTIFS_DEBUG=true deno test --unstable --allow-plugin --allow-all tests/test.ts
import { notify } from "../ts/mod.ts";

Deno.test({
  name: "Send Notification",
  async fn(): Promise<void> {
    await notify({
      title: "Hey",
      message: "Hello World",
      icon: {
        app: "Terminal",
      },
      sound: "Basso"
    });
  },
});
