import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MessageEntity } from 'src/domain/message/entities/message.entity';
import {
  MESSAGE_WRITE_REPO,
  IMessageWrite,
} from '../ports/imessage-write.port';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(MESSAGE_WRITE_REPO)
    private readonly repo: IMessageWrite,
  ) {}

  async execute(title: string): Promise<MessageEntity> {
    const id = uuidv4();

    const message = MessageEntity.create(id, title, 'user');

    await this.repo.insert(message);

    return message;
  }
}
