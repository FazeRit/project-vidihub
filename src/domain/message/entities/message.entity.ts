export type MessageRole = 'user' | 'ai';

export class MessageEntity {
  public readonly id: string;
  public readonly role: MessageRole;
  public readonly createdAt: Date;

  private _content: string;
  private _updatedAt: Date;

  private constructor(
    id: string,
    role: MessageRole,
    createdAt: Date,
    content: string,
    updatedAt: Date,
  ) {
    this.id = id;
    this.role = role;
    this.createdAt = createdAt;

    this._content = content;
    this._updatedAt = updatedAt;

    this.validate();
  }

  static create(id: string, content: string, role: MessageRole): MessageEntity {
    const now = new Date();

    return new MessageEntity(id, role, now, content, now);
  }

  static reconstitute(
    id: string,
    role: MessageRole,
    createdAt: Date,
    content: string,
    updatedAt: Date,
  ): MessageEntity {
    return new MessageEntity(id, role, createdAt, content, updatedAt);
  }

  public updateContent(newContent: string): void {
    this._content = newContent;

    this._updatedAt = new Date();

    this.validate();
  }

  get content(): string {
    return this._content;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validate(): void {
    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Message text cannot be empty');
    }
  }
}
