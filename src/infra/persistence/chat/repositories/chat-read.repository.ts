import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { ChatModel } from '../entities/chat.model';

@Injectable()
export class ChatReadRepository {
  private readonly repo: Repository<ChatModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(ChatModel);
  }
}
