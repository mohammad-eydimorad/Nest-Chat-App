import { RabbitMqExchangeConfigInterface } from './exchanges.interface';

export class RMQConfigInterface {
  urls?: string[];
  callTimeoutMS?: number = 180 * 1000;
  expireInMS?: number = 10 * 1000;
  //
  public rsa?: {
    private: string;
  };
  //
  exchanges: RabbitMqExchangeConfigInterface[];
  prefetchCount?: number;
  isGlobalPrefetchCount?: boolean;
  vhost?: string;
  managementUrl?: string;
}
