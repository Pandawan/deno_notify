import {filename, DenoCore} from  "./_open_plugin.ts";

// This will be checked against open resources after Plugin.close()
// in runTestClose() below.
const resourcesPre = Deno.resources();

const rid = Deno.openPlugin(filename);

const { testSync, testAsync } = DenoCore.ops();
if (!(testSync > 0)) {
  throw "bad op id for testSync";
}
if (!(testAsync > 0)) {
  throw "bad op id for testAsync";
}

const textDecoder = new TextDecoder();

function runTestSync() {
  const response = DenoCore.dispatch(
    testSync,
    new Uint8Array([116, 101, 115, 116]),
    new Uint8Array([116, 101, 115, 116])
  );

  console.log(`Plugin Sync Response: ${textDecoder.decode(response)}`);
}

DenoCore.setAsyncHandler(testAsync, (response: any) => {
  console.log(`Plugin Async Response: ${textDecoder.decode(response)}`);
});

function runTestAsync() {
  const response = DenoCore.dispatch(
    testAsync,
    new Uint8Array([116, 101, 115, 116]),
    new Uint8Array([116, 101, 115, 116])
  );

  if (response != null || response != undefined) {
    throw new Error("Expected null response!");
  }
}

function runTestOpCount() {
  const start = Deno.metrics();

  DenoCore.dispatch(testSync, new Uint8Array([116, 101, 115, 116]));

  const end = Deno.metrics();

  if (end.opsCompleted - start.opsCompleted !== 1) {
    // one op for the plugin and one for Deno.metrics
    throw new Error("The opsCompleted metric is not correct!");
  }
  if (end.opsDispatched - start.opsDispatched !== 1) {
    // one op for the plugin and one for Deno.metrics
    throw new Error("The opsDispatched metric is not correct!");
  }
}

function runTestPluginClose() {
  Deno.close(rid);

  const resourcesPost = Deno.resources();

  const preStr = JSON.stringify(resourcesPre, null, 2);
  const postStr = JSON.stringify(resourcesPost, null, 2);
  if (preStr !== postStr) {
    throw new Error(`Difference in open resources before openPlugin and after Plugin.close(): 
Before: ${preStr}
After: ${postStr}`);
  }
}

runTestSync();
runTestAsync();

runTestOpCount();
runTestPluginClose();