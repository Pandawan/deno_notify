import { notify, pluginId } from "../ts/prepared.ts";
import { assert } from "https://deno.land/std@v0.53.0/testing/asserts.ts";

Deno.test({
  name: "Check plugin id",
  async fn(): Promise<void> {
    assert(pluginId !== null);
  },
});

// Need to send complete notification before simple because the icon can't change after being set on mac
Deno.test({
  name: "Send complete notification",
  async fn(): Promise<void> {
    await notify({
      title: "Hey",
      message: "Hello World",
      icon: {
        app: "Safari",
      },
      sound: "Basso",
    });
  },
});

Deno.test({
  name: "Send simple notification",
  async fn(): Promise<void> {
    await notify("Message");
  },
});