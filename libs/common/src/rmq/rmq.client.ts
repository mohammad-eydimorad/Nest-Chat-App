import { Injectable } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { RabbitMqClientBase } from './rmq.client.base';
import { PatternInterface, PayloadInterface } from './config-models';

@Injectable()
export class RmqClient extends RabbitMqClientBase {
  protected get channelWrapper(): ChannelWrapper {
    return (
      this._channelWrapper || (this._channelWrapper = this.createChannel())
    );
  }

  private _channelWrapper: ChannelWrapper;

  public async send(
    pattern: PatternInterface,
    data: PayloadInterface,
    noLogData = false,
  ): Promise<void> {
    const routingKey: string = pattern.channel;
    if (!routingKey) {
      const msg: { pattern: PatternInterface; data: any } = { pattern, data };
      throw new Error(
        `Trying to publish message without specifying channel. Message object: ${msg}`,
      );
    }

    const { exchange }: PatternInterface = pattern;
    await this.channelWrapper.publish(
      exchange,
      routingKey,
      data,
      pattern.options,
    );

    this.logger.log(
      {
        context: `${this.logContext} request`,
        data: noLogData ? undefined : data,
        exchange,
        options: pattern.options,
        routingKey,
      },
      this.logContext,
    );
  }

  public async close(): Promise<void> {
    if (this._channelWrapper) {
      await this._channelWrapper.close();
      this._channelWrapper = null;
    }

    await super.close();
  }

  private createChannel(): ChannelWrapper {
    return this.client.createChannel({
      json: true,
    });
  }
}
