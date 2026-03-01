import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { ChatModel } from '../entities/chat.model';
import { MessageMapper } from '../../message/mappers/message.mapper';

export class ChatMapper {
  static toDomain(orm: ChatModel): ChatEntity {
    const messages = (orm.messages || []).map((m) => MessageMapper.toDomain(m));

    return ChatEntity.reconstitute(
      orm.id,
      orm.createdAt,
      orm.title,
      orm.description,
      orm.updatedAt,
      messages,
    );
  }

  static toPersistence(domain: ChatEntity): ChatModel {
    const orm = new ChatModel();

    orm.id = domain.id;
    orm.createdAt = domain.createdAt;

    orm.title = domain.title;
    orm.description = domain.description;
    orm.updatedAt = domain.updatedAt;

    if (domain.messages) {
      orm.messages = domain.messages.map((messageDomain) => {
        const messageModel = MessageMapper.toPersistence(messageDomain);

        messageModel.chat = orm;

        return messageModel;
      });
    }

    return orm;
  }
}
