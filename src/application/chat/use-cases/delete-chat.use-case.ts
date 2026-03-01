import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAT_WRITE_REPO, IChatWrite } from '../ports/ichat-write.port';
import { CHAT_READ_REPO, IChatRead } from '../ports/ichat-read.port';

@Injectable()
export class DeleteChatUseCase {
  constructor(
    @Inject(CHAT_WRITE_REPO)
    private readonly writeRepo: IChatWrite,
    @Inject(CHAT_READ_REPO)
    private readonly readRepo: IChatRead,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.readRepo.exists(id);
    if (!exists) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    await this.writeRepo.delete(id);
  }
}
