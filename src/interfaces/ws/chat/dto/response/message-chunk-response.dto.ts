export class MessageChunkResponseDto {
  messageId: string;
  chunk: string;

  constructor(messageId: string, chunk: string) {
    this.messageId = messageId;
    this.chunk = chunk;
  }
}
