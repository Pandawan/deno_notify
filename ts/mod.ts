import { unwrapResponse, opSync } from './plugin.ts';

export interface SendNotificationParams {
    title: string;
    message: string;
    icon?: string;
}

export interface SendNotificationResult {
}

export function sendNotification(params: SendNotificationParams): SendNotificationResult {
  return unwrapResponse(opSync("notifs_send", params));
}