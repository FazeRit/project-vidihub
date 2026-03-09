export abstract class IAiGateway {
  abstract generateStream(message: string): AsyncGenerator<string>;
}
