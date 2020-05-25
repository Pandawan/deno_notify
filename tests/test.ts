// Run test with DENO_NOTIFS_PLUGIN_BASE=./target/debug/ DENO_NOTIFS_DEBUG=true deno test --unstable --allow-plugin --allow-all tests/test.ts
import { sendNotification } from '../ts/mod.ts';

Deno.test({
  name: 'Send Notification',
  fn(): void {
    sendNotification({
      title: 'Hey',
      message: 'Hello World'
    });
  }
});