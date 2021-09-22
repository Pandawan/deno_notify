use deno_core::serde::Deserialize;
use deno_core::serde_json::{self, json};
use notify_rust::{Error as NotifyRustError, Notification};

#[derive(Debug, Deserialize)]
struct NotificationOptions {
    //#[serde(rename = "_title")]
    title: String,

    //#[serde(rename = "_subtitle")]
    subtitle: Option<String>,

    //#[serde(rename = "_body")]
    body: Option<String>,

    //#[serde(rename = "_icon")]
    icon: Option<String>,

    //#[serde(rename = "_soundName")]
    sound_name: Option<String>,
}

fn send_notification(options: NotificationOptions) -> Result<(), NotifyRustError> {
    let mut notification = Notification::new();

    // Notification title
    notification.summary(&options.title);

    // Notification subtitle
    if let Some(subtitle) = &options.subtitle {
        notification.subtitle(subtitle);
    }

    // Notification body
    if let Some(body) = &options.body {
        notification.body(body);
    }

    // Add an icon
    if let Some(icon) = &options.icon {
        notification.icon(icon);
    }

    // Add a sound
    if let Some(sound_name) = &options.sound_name {
        notification.sound_name(sound_name);
    }

    // Display it
    match notification.show() {
        Ok(_) => Ok(()),
        Err(error) => Err(error),
    }
}

fn wrap_error_to_json(error: &str) -> String {
    json!({ "error": error.to_string() }).to_string()
}

// TODO: Args & Return types are not FFI-safe
#[no_mangle]
pub extern "C" fn notify_send(data: String) -> String {
    let options: NotificationOptions = match serde_json::from_str(&data) {
        Ok(opt) => opt,
        Err(error) => return wrap_error_to_json(&error.to_string()),
    };

    match send_notification(options) {
        Ok(_) => "{ ok: true }".to_string(),
        Err(error) => wrap_error_to_json(&error.to_string()),
    }
}
