// Run test with DENO_NOTIFS_PLUGIN_BASE=file:///path/to/target/debug deno run --unstable --allow-plugin --allow-all test.ts
import { notify } from '../ts/mod.ts';

notify({
  title: 'Hey',
  message: 'Hello World'
});
