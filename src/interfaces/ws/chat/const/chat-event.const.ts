export const CHAT_EVENTS = {
  SERVER: {
    CHAT_CREATED: 'chat_created',
    CHAT_DELETED: 'chat_deleted',
    MESSAGE_RECEIVED: 'message_received',
    MESSAGE_CHUNK: 'message_chunk',
    MESSAGE_FINISHED: 'message_finished',
    MESSAGE_DELETED: 'message_deleted',
    CHAT_SELECTED: 'chat_selected',
    ERROR: 'chat_error',
  },
  CLIENT: {
    CREATE_CHAT: 'create_chat',
    DELETE_CHAT: 'delete_chat',
    SEND_MESSAGE: 'send_message',
    SELECT_CHAT: 'select_chat',
    DELETE_MESSAGE: 'delete_message',
  },
} as const;
