import { Options } from 'amqplib';
import { RabbitMqQueueConfigInterface } from './rmq-queue-config.interface';

export interface RabbitMqExchangeConfigInterface {
  name: string;
  type: string;
  options: Options.AssertQueue;
  queues: RabbitMqQueueConfigInterface[];
}
