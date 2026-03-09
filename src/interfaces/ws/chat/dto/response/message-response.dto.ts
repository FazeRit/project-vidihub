import { MessageEntity } from 'src/domain/chat/entities/message.entity';

export class MessageResponseDto {
  public readonly id: string;
  public readonly content: string;
  public readonly role: string;
  public readonly createdAt: Date;

  constructor(entity: MessageEntity) {
    this.id = entity.id;
    this.content = entity.content;
    this.role = entity.role;
    this.createdAt = entity.createdAt;
  }
}
