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
import { SendMessageDto } from './dto/request/send-message.dto';
import { DeleteMessageDto } from './dto/request/delete-message.dto';
import { DeleteMessageUseCase } from 'src/application/chat/use-cases/delete-message.use-case';
import { CreateChatDto } from './dto/request/create-chat.dto';
import { CreateChatUseCase } from 'src/application/chat/use-cases/create-chat.use-case';
import { DeleteChatDto } from './dto/request/delete-chat.dto';
import { DeleteChatUseCase } from 'src/application/chat/use-cases/delete-chat.use-case';
import { Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { SelectChatDto } from './dto/request/select-chat.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { validationPipeConfig } from 'src/infra/config/validation-pipe/validation-pipe.config';
import { GetChatHistoryUseCase } from 'src/application/chat/use-cases/get-chat-history.use-case';
import { CHAT_EVENTS } from './const/chat-event.const';
import { ChatStreamEventType } from 'src/application/chat/const/chat-stream.const';
import { MessageChunkResponseDto } from './dto/response/message-chunk-response.dto';
import { MessageResponseDto } from './dto/response/message-response.dto';

@UsePipes(
  new ValidationPipe({
    ...validationPipeConfig,
    exceptionFactory: (errors) => new WsException(errors),
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
    private readonly getChatHistoryUseCase: GetChatHistoryUseCase,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.info(`Client connected: ${client.id}`);
  }

  @SubscribeMessage(CHAT_EVENTS.CLIENT.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, content } = dto;

    if (!client.rooms.has(chatId)) {
      throw new WsException('You are not connected to this chat');
    }

    const stream = this.sendMessageUseCase.execute(chatId, content);

    for await (const event of stream) {
      switch (event.type) {
        case ChatStreamEventType.USER_MESSAGE_SAVED:
          this.server
            .to(chatId)
            .emit(
              CHAT_EVENTS.SERVER.MESSAGE_RECEIVED,
              new MessageResponseDto(event.payload),
            );
          break;

        case ChatStreamEventType.AI_CHUNK:
          this.server
            .to(chatId)
            .emit(
              CHAT_EVENTS.SERVER.MESSAGE_CHUNK,
              new MessageChunkResponseDto(
                event.payload.messageId,
                event.payload.chunk,
              ),
            );
          break;

        case ChatStreamEventType.AI_MESSAGE_COMPLETE:
          this.server
            .to(chatId)
            .emit(
              CHAT_EVENTS.SERVER.MESSAGE_FINISHED,
              new MessageResponseDto(event.payload),
            );
          break;
      }
    }
  }

  @SubscribeMessage(CHAT_EVENTS.CLIENT.DELETE_MESSAGE)
  async handleDeleteMessage(@MessageBody() dto: DeleteMessageDto) {
    const { chatId, messageId } = dto;

    await this.deleteMessageUseCase.execute(chatId, messageId);

    this.server.to(chatId).emit(CHAT_EVENTS.SERVER.MESSAGE_DELETED, {
      chatId,
      messageId,
    });
  }

  @SubscribeMessage(CHAT_EVENTS.CLIENT.SELECT_CHAT)
  async handleSelectChat(
    @MessageBody() dto: SelectChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, limit } = dto;

    const currentRooms = Array.from(client.rooms);
    for (const room of currentRooms) {
      if (room !== client.id) {
        await client.leave(room);
      }
    }

    await client.join(chatId);

    const messages = await this.getChatHistoryUseCase.execute(chatId, limit);

    client.emit(CHAT_EVENTS.SERVER.CHAT_SELECTED, {
      chatId: chatId,
      messages: messages,
    });
  }

  @SubscribeMessage(CHAT_EVENTS.CLIENT.CREATE_CHAT)
  async handleCreateChat(
    @MessageBody() dto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const chat = await this.createChatUseCase.execute(
        dto.title,
        dto.description,
      );

      await client.join(chat.id);

      client.emit(CHAT_EVENTS.SERVER.CHAT_CREATED, {
        id: chat.id,
        title: chat.title,
        description: chat.description,
      });
    } catch (e) {
      this.logger.error('Create chat error', e);
      throw new WsException('error');
    }
  }

  @SubscribeMessage(CHAT_EVENTS.CLIENT.DELETE_CHAT)
  async handleDeleteChat(@MessageBody() dto: DeleteChatDto) {
    const { chatId } = dto;

    await this.deleteChatUseCase.execute(chatId);

    this.server.to(chatId).emit(CHAT_EVENTS.SERVER.CHAT_DELETED, {
      chatId,
    });

    this.server.in(chatId).socketsLeave(chatId);
  }
}
