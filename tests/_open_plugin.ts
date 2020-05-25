const filenameBase = "deno_notifs";

let filenameSuffix = ".so";
let filenamePrefix = "lib";

if (Deno.build.os === "windows") {
  filenameSuffix = ".dll";
  filenamePrefix = "";
}
if (Deno.build.os === "darwin") {
  filenameSuffix = ".dylib";
}

const target = Deno.args[0] || "debug";

export const filename = `../target/${target}/${filenamePrefix}${filenameBase}${filenameSuffix}`;

interface DENOCORE {
  ops: () => { [key: string]: number },
  setAsyncHandler(rid: number, handler: Function): void,
  dispatch(
    rid: number,
    msg: any,
    buf?: ArrayBufferView,
  ): Uint8Array | undefined;
};

export const DenoCore = (Deno as any).core as DENOCORE;