import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { ChatStreamEventType } from '../const/chat-stream.const';

export type TChatStreamEventType = typeof ChatStreamEventType;

export interface ChatStreamUserMessageSaved {
  type: TChatStreamEventType['USER_MESSAGE_SAVED'];
  payload: MessageEntity;
}

export interface ChatStreamAiChunk {
  type: TChatStreamEventType['AI_CHUNK'];
  payload: {
    messageId: string;
    chunk: string;
  };
}

export interface ChatStreamAiMessageComplete {
  type: TChatStreamEventType['AI_MESSAGE_COMPLETE'];
  payload: MessageEntity;
}

export type ChatStreamEvent =
  | ChatStreamUserMessageSaved
  | ChatStreamAiChunk
  | ChatStreamAiMessageComplete;
