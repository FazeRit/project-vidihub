import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAT_READ_REPO, IChatRead } from '../ports/ichat-read.port';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  IMessageWrite,
  MESSAGE_WRITE_REPO,
} from '../ports/imessage-write.port';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CHAT_READ_REPO)
    private readonly chatRead: IChatRead,
    @Inject(CHAT_WRITE_REPO)
    private readonly chatWrite: IChatWrite,
    @Inject(MESSAGE_WRITE_REPO)
    private readonly messageWrite: IMessageWrite,
  ) {}

  async execute(chatId: string, content: string): Promise<MessageEntity> {
    const chat = await this.chatRead.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const messageId = uuidv4();
    const message = MessageEntity.create(messageId, content, 'user');

    chat.addMessage(message);

    await this.messageWrite.save(message);

    await this.chatWrite.updateLastActivity(chatId);

    // temporary before connecting to ai
    return message;
  }
}
