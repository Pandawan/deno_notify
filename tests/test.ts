import { notify, pluginId } from "../ts/prepared.ts";
import { assert } from "https://deno.land/std@v0.53.0/testing/asserts.ts";

Deno.test({
  name: "Send Notification",
  async fn(): Promise<void> {
    await notify({
      title: "Hey",
      message: "Hello World",
      icon: {
        app: "Terminal",
      },
      sound: "Basso",
    });
  },
});

Deno.test({
  name: "Check plugin id",
  async fn(): Promise<void> {
    assert(pluginId !== null);
  }
})