import { RmqClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { RmqMessagesEnum } from './user.patterns';
import { UserResigsteedEvent } from './user.events';

@Injectable()
export class UserEventsProducer {
  constructor(@Inject() private readonly rabbitClient: RmqClient) {}

  public produceUserRegisteredEvent(
    userRegisteredEvent: UserResigsteedEvent,
  ): void {
    this.send(RmqMessagesEnum.UserRegistered, userRegisteredEvent);
  }

  private async send(event: RmqMessagesEnum, payload: any): Promise<void> {
    await this.rabbitClient.send(
      { channel: event, exchange: 'async_events' },
      { name: event, payload },
    );
  }
}
