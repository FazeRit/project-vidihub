import { Inject, Injectable } from '@nestjs/common';
import {
  IMessageWrite,
  MESSAGE_WRITE_REPO,
} from '../ports/imessage-write.port';

@Injectable()
export class DeleteMessageUseCase {
  constructor(
    @Inject(MESSAGE_WRITE_REPO)
    private readonly repo: IMessageWrite,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
