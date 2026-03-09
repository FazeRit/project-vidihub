import { Inject, Injectable } from '@nestjs/common';
import { IMessageRead, MESSAGE_READ_REPO } from '../ports/imessage-read.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';

@Injectable()
export class GetChatHistoryUseCase {
  constructor(
    @Inject(MESSAGE_READ_REPO)
    private readonly messageRepository: IMessageRead,
  ) {}

  async execute(
    chatId: string,
    limit: number = 50,
  ): Promise<Array<MessageEntity>> {
    return await this.messageRepository.findByChatId(chatId, limit);
  }
}
