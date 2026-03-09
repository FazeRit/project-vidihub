import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAT_READ_REPO, IChatRead } from '../ports/ichat-read.port';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';
import { MessageEntity } from 'src/domain/chat/entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  IMessageWrite,
  MESSAGE_WRITE_REPO,
} from '../ports/imessage-write.port';
import { AI_GATEWAY } from 'src/infra/gateways/ai/const/ai.const';
import { IAiGateway } from '../ports/iai-gateway.port';
import { ChatStreamEventType } from '../const/chat-stream.const';
import { ChatStreamEvent } from '../types/chat-stream.type';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CHAT_READ_REPO)
    private readonly chatRead: IChatRead,
    @Inject(CHAT_WRITE_REPO)
    private readonly chatWrite: IChatWrite,
    @Inject(MESSAGE_WRITE_REPO)
    private readonly messageWrite: IMessageWrite,
    @Inject(AI_GATEWAY)
    private readonly aiGateway: IAiGateway,
  ) {}

  async *execute(
    chatId: string,
    content: string,
  ): AsyncGenerator<ChatStreamEvent> {
    const chat = await this.chatRead.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const userMessageId = uuidv4();
    const userMessage = MessageEntity.create(userMessageId, content, 'user');

    await this.messageWrite.save(userMessage);
    await this.chatWrite.updateLastActivity(chatId);

    yield {
      type: ChatStreamEventType.USER_MESSAGE_SAVED,
      payload: userMessage,
    };

    const aiMessageId = uuidv4();
    let fullAiContent = '';

    const stream = this.aiGateway.generateStream(content);

    for await (const chunk of stream) {
      fullAiContent += chunk;

      yield {
        type: ChatStreamEventType.AI_CHUNK,
        payload: {
          messageId: aiMessageId,
          chunk,
        },
      };
    }

    const aiMessage = MessageEntity.reconstitute(
      aiMessageId,
      'ai',
      new Date(),
      fullAiContent,
      new Date(),
    );

    await this.messageWrite.save(aiMessage);

    await this.chatWrite.updateLastActivity(chatId);

    yield {
      type: ChatStreamEventType.AI_MESSAGE_COMPLETE,
      payload: aiMessage,
    };
  }
}
