export enum SocketEvents {
  CLIENT_CONNECTED = "client-connected",

  ADMIN_HANDSHAKE = "admin:handshake",
  USER_HANDSHAKE = "user:handshake",

  // USER_STATUS = "user:status",

  // CHAT_NEW_MESSAGE = "chat:new-message",
  // CHAT_IS_TYPING = "chat:is-typing",
  // CHAT_MESSAGE_DELETED = "chat:message-deleted",

  NEW_NOTIFICATION = "event:new-notification",
}

export type SocketEmitEvent = {
  name: SocketEvents;
  eventData: { event_id: string; event_type: string };
  type: "success" | "error" | "warn" | "info";
  title: string;
  body: string;
};
