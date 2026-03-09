import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import { IAiGateway } from 'src/application/chat/ports/iai-gateway.port';

@Injectable()
export class VercelGateway implements IAiGateway {
  private readonly openai: OpenAIProvider;

  constructor(private readonly config: ConfigService) {
    this.openai = createOpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
      baseURL: this.config.get<string>('OPENAI_BASE_URL'),
    });
  }

  async *generateStream(message: string): AsyncGenerator<string> {
    const result = await streamText({
      model: this.openai('openai/gpt-oss-120b:free'),
      prompt: message,
    });

    for await (const textPart of result.textStream) {
      yield textPart;
    }
  }
}
