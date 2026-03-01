import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMessageWrite,
  MESSAGE_WRITE_REPO,
} from '../ports/imessage-write.port';
import { CHAT_READ_REPO, IChatRead } from '../ports/ichat-read.port';
import { IMessageRead, MESSAGE_READ_REPO } from '../ports/imessage-read.port';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';

@Injectable()
export class DeleteMessageUseCase {
  constructor(
    @Inject(MESSAGE_WRITE_REPO)
    private readonly writeRepo: IMessageWrite,
    @Inject(CHAT_READ_REPO)
    private readonly chatRead: IChatRead,
    @Inject(MESSAGE_READ_REPO)
    private readonly messageRead: IMessageRead,
    @Inject(CHAT_WRITE_REPO)
    private readonly chatWrite: IChatWrite,
  ) {}

  async execute(chatId: string, messageId: string): Promise<void> {
    const message = await this.messageRead.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.writeRepo.delete(messageId);

    await this.chatWrite.updateLastActivity(chatId);
  }
}
