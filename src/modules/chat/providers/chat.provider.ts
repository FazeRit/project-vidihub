import { Provider } from '@nestjs/common';
import { CHAT_READ_REPO } from 'src/application/chat/ports/ichat-read.port';
import { CHAT_WRITE_REPO } from 'src/application/chat/ports/ichat-write.port';
import { CreateChatUseCase } from 'src/application/chat/use-cases/create-chat.use-case';
import { DeleteChatUseCase } from 'src/application/chat/use-cases/delete-chat.use-case';
import { ChatReadRepository } from 'src/infra/persistence/chat/repositories/chat-read.repository';
import { ChatWriteRepository } from 'src/infra/persistence/chat/repositories/chat-write.repository';

export const chatProviders: Array<Provider> = [
  {
    provide: CHAT_READ_REPO,
    useClass: ChatReadRepository,
  },
  {
    provide: CHAT_WRITE_REPO,
    useClass: ChatWriteRepository,
  },
  CreateChatUseCase,
  DeleteChatUseCase,
];
