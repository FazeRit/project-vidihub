export abstract class IAiService {
  abstract generateResponse(message: string): Promise<string>;
}
