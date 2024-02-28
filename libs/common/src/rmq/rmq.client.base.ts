import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { AmqpConnectionManager, connect } from 'amqp-connection-manager';
import { RabbitMqConfig } from './config-models';

@Injectable()
export abstract class RabbitMqClientBase
  implements OnModuleDestroy, OnApplicationShutdown
{
  private _client: AmqpConnectionManager;

  protected get logContext(): string {
    return this.constructor.name;
  }

  protected get client(): AmqpConnectionManager {
    return this._client || (this._client = this.createClient());
  }

  constructor(
    protected readonly config: RabbitMqConfig,
    protected readonly logger: Logger,
  ) {}

  public async close(): Promise<void> {
    if (this._client) {
      await this._client.close();
      this._client = null;
    }
  }

  public async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.close();
  }

  private createClient(): AmqpConnectionManager {
    const client: AmqpConnectionManager = connect(
      this.config.getConnectionUrls(),
    );

    client.on('connect', () =>
      this.logger.log('RabbitMQ Client connected', this.logContext),
    );
    client.on('disconnect', () =>
      this.logger.log('RabbitMQ Client disconnected', this.logContext),
    );

    return client;
  }
}
