import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from 'src/interfaces/ws/chat/chat.gateway';
import { chatProviders } from './providers/chat.provider';
import { messageProviders } from './providers/message.provider';
import { ChatModel } from 'src/infra/persistence/chat/entities/chat.model';
import { MessageModel } from 'src/infra/persistence/chat/entities/message.model';
import { AI_GATEWAY } from 'src/infra/gateways/ai/const/ai.const';
import { VercelGateway } from 'src/infra/gateways/ai/vercel.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatModel, MessageModel])],
  providers: [
    ...chatProviders,
    ...messageProviders,
    ChatGateway,
    {
      provide: AI_GATEWAY,
      useClass: VercelGateway,
    },
  ],
  exports: [...chatProviders, ...messageProviders],
})
export class ChatModule {}
