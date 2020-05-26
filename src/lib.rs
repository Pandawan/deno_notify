use deno_core::plugin_api::Buf;
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;
use notify_rust::{get_bundle_identifier_or_default, set_application, Notification};
use serde::{Deserialize, Serialize};
use std::path::Path;

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
enum Icon {
  #[serde(rename = "app")]
  App(String),
  #[serde(rename = "path")]
  Path(String),
  #[serde(rename = "name")]
  Name(String),
}

#[derive(Deserialize)]
struct SendNotificationParams {
  title: String,
  message: String,
  icon: Option<Icon>,
  sound: Option<String>,
}

#[derive(Serialize)]
struct SendNotificationResult {}

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

  // TODO: Modularize these calls
  match Notification::new()
    .summary(&params.title)
    .body(&params.message)
    .icon(match &params.icon {
      Some(value) => match value {
        Icon::App(app_name) => {
          // Mac needs to pretend to be another app
          if cfg!(target_os = "macos") {
            let app_id = get_bundle_identifier_or_default(app_name);
            if let Err(err) = set_application(&app_id).map_err(|f| format!("{}", f)) {
              response.err = Some(err);
            }
          }
          app_name
        }
        Icon::Path(file_path) => {
          if Path::new(file_path).exists() {
            file_path
          } else {
            "terminal"
          }
        }
        Icon::Name(icon_name) => icon_name,
      },
      None => "terminal",
    })
    .sound_name(match &params.sound {
      Some(sound_path) => sound_path,
      None => "",
    })
    .show()
  {
    Ok(_) => {
      response.ok = Some(SendNotificationResult {});
    }
    Err(error) => {
      response.err = Some(error.to_string());
    }
  };

  let result: Buf = serde_json::to_vec(&response).unwrap().into_boxed_slice();

  Op::Sync(result)
}
