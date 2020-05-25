use deno_core::plugin_api::Buf;
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;
use notify_rust::Notification;
use serde::{Serialize, Deserialize};

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
  interface.register_op("notifs_send", op_notifs_send);
}

#[derive(Serialize)]
struct NotifsResponse<T> {
    err: Option<String>,
    ok: Option<T>,
}

#[derive(Deserialize)]
struct SendNotificationParams {
    title: String,
    message: String,
    icon: Option<String>
}

#[derive(Serialize)]
struct SendNotificationResult {
}


fn op_notifs_send(
  _interface: &mut dyn Interface,
  data: &[u8],
  _zero_copy: Option<ZeroCopyBuf>,
) -> Op {
  let mut response: NotifsResponse<SendNotificationResult> = NotifsResponse {
      err: None,
      ok: None,
  };

  let params: SendNotificationParams = serde_json::from_slice(data).unwrap();

  match Notification::new()
      .summary(&params.title)
      .body(&params.message)
      .icon(match &params.icon {
        Some(value) => value,
        None => "terminal"
      })
      .show() {
        Ok(_) => {
          response.ok = Some(SendNotificationResult {});
        },
        Err(error) => {
          response.err = Some(error.to_string());
        }
      }

  let result: Buf = serde_json::to_vec(&response).unwrap().into_boxed_slice();

  Op::Sync(result)
}