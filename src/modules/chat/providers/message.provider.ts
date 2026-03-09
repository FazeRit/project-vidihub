import { Provider } from '@nestjs/common';
import { MessageWriteRepository } from 'src/infra/persistence/chat/repositories/message-write.repository';
import { MessageReadRepository } from 'src/infra/persistence/chat/repositories/message-read.repository';
import { MESSAGE_READ_REPO } from 'src/application/chat/ports/imessage-read.port';
import { MESSAGE_WRITE_REPO } from 'src/application/chat/ports/imessage-write.port';
import { DeleteMessageUseCase } from 'src/application/chat/use-cases/delete-message.use-case';
import { SendMessageUseCase } from 'src/application/chat/use-cases/send-message.use-case';
import { GetChatHistoryUseCase } from 'src/application/chat/use-cases/get-chat-history.use-case';

export const messageProviders: Array<Provider> = [
  {
    provide: MESSAGE_WRITE_REPO,
    useClass: MessageWriteRepository,
  },
  {
    provide: MESSAGE_READ_REPO,
    useClass: MessageReadRepository,
  },
  SendMessageUseCase,
  DeleteMessageUseCase,
  GetChatHistoryUseCase,
];
