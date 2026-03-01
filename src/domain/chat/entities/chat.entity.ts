import { MessageEntity } from 'src/domain/chat/entities/message.entity';

export class ChatEntity {
  public readonly id: string;
  public readonly createdAt: Date;

  private _title: string;
  private _description: string;
  private _updatedAt: Date;

  private _messages: Array<MessageEntity>;

  private constructor(
    id: string,
    createdAt: Date,
    title: string,
    description: string,
    updatedAt: Date,
    messages: Array<MessageEntity> = [],
  ) {
    this.id = id;
    this.createdAt = createdAt;

    this._title = title;
    this._description = description;
    this._updatedAt = updatedAt;
    this._messages = messages;

    this.validate();
  }

  static create(
    id: string,
    title: string = 'New Chat',
    description: string = '',
  ): ChatEntity {
    const now = new Date();

    return new ChatEntity(id, now, title, description, now, []);
  }

  static reconstitute(
    id: string,
    createdAt: Date,
    title: string,
    description: string,
    updatedAt: Date,
    messages: Array<MessageEntity>,
  ): ChatEntity {
    return new ChatEntity(
      id,
      createdAt,
      title,
      description,
      updatedAt,
      messages,
    );
  }

  get messages(): ReadonlyArray<MessageEntity> {
    return Object.freeze([...this._messages]);
  }

  public addMessage(message: MessageEntity): void {
    this._messages.push(message);

    this._updatedAt = new Date();
  }

  public deleteMessage(messageId: string): void {
    const messageIndex = this._messages.findIndex((m) => m.id === messageId);

    if (messageIndex === -1) {
      throw new Error('Message not found in this chat');
    }

    this._messages.splice(messageIndex, 1);

    this._updatedAt = new Date();
  }

  public updateTitle(newTitle: string): void {
    this._title = newTitle;

    this._updatedAt = new Date();

    this.validate();
  }

  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new Error('Chat title cannot be empty');
    }
  }
}
