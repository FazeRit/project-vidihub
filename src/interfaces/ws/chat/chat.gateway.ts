import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from 'src/application/chat/use-cases/send-message.use-case';
import { SendMessageDto } from './dto/send-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { DeleteMessageUseCase } from 'src/application/chat/use-cases/delete-message.use-case';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateChatUseCase } from 'src/application/chat/use-cases/create-chat.use-case';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { DeleteChatUseCase } from 'src/application/chat/use-cases/delete-chat.use-case';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { SelectChatDto } from './dto/select-chat.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@WebSocketGateway({
  namespace: 'chats',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    private readonly createChatUseCase: CreateChatUseCase,
    private readonly deleteChatUseCase: DeleteChatUseCase,
  ) {}

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, content } = dto;

    if (!client.rooms.has(dto.chatId)) {
      throw new WsException('Ви не приєднані до цього чату');
    }

    const message = await this.sendMessageUseCase.execute(chatId, content);

    this.server.to(chatId).emit('message_received', {
      id: message.id,
      content: message.content,
      role: message.role,
      createdAt: message.createdAt,
    });
  }

  @SubscribeMessage('delete_message')
  async handleDeleteMessage(@MessageBody() dto: DeleteMessageDto) {
    const { chatId, messageId } = dto;

    await this.deleteMessageUseCase.execute(chatId, messageId);

    await this.server.to(chatId).emit('message_deleted', {
      chatId,
      messageId,
    });
  }

  @SubscribeMessage('select_chat')
  async handleSelectChat(
    @MessageBody() dto: SelectChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    for (const room of client.rooms) {
      if (room !== client.id) {
        await client.leave(room);
      }
    }

    await client.join(dto.chatId);

    client.emit('chat_selected', {
      chatId: dto.chatId,
    });
  }

  @SubscribeMessage('create_chat')
  async handleCreateChat(
    @MessageBody() dto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { title, description } = dto;

    const chat = await this.createChatUseCase.execute(title, description);

    await client.join(chat.id);

    client.emit('chat_created', {
      id: chat.id,
      title: chat.title,
      description: chat.description,
      createdAt: chat.createdAt,
    });
  }

  @SubscribeMessage('delete_chat')
  async handleDeleteChat(@MessageBody() dto: DeleteChatDto) {
    const { chatId } = dto;

    await this.deleteChatUseCase.execute(chatId);

    this.server.to(chatId).emit('chat_deleted', {
      chatId,
    });

    this.server.in(chatId).socketsLeave(chatId);
  }
}
