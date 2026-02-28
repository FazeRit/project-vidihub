import { Inject, Injectable } from '@nestjs/common';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';

@Injectable()
export class DeleteChatUseCase {
  constructor(
    @Inject(CHAT_WRITE_REPO)
    private readonly repo: IChatWrite,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
