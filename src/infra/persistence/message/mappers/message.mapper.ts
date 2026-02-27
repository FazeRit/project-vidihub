import { MessageEntity } from 'src/domain/message/entities/message.entity';
import { MessageModel, MessageRoleEnum } from '../entities/message.model';

export class MessageMapper {
  static toDomain(orm: MessageModel): MessageEntity {
    const role = orm.role === MessageRoleEnum.AI ? 'ai' : 'user';

    return MessageEntity.reconstitute(
      orm.id,
      role,
      orm.createdAt,
      orm.content,
      orm.updatedAt,
    );
  }

  static toPersistence(domain: MessageEntity): MessageModel {
    const orm = new MessageModel();

    orm.id = domain.id;
    orm.content = domain.content;
    orm.role = domain.role === 'ai' ? MessageRoleEnum.AI : MessageRoleEnum.USER;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    return orm;
  }
}
