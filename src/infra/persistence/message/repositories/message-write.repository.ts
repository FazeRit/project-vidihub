import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE_KEY } from 'src/shared/constants/datasource.const';
import { MessageModel } from '../entities/message.model';

@Injectable()
export class MessageWriteRepository {
  private readonly repo: Repository<MessageModel>;

  constructor(
    @Inject(DATA_SOURCE_KEY)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(MessageModel);
  }
}
