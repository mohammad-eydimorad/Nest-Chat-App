import { Injectable } from '@nestjs/common';
import { RMQConfigInterface } from './rmq-config.interface';
import { RabbitMqExchangeConfigInterface } from './exchanges.interface';
import { RabbitMqQueueConfigInterface } from './rmq-queue-config.interface';
import { RabbitMqClientOptionsInterface } from './rmq-client-options.interface';
import { MessageEncryptionOptionsInterface } from './message-encryption-options.interface';

@Injectable()
export class RabbitMqConfig {
  constructor(private readonly config: RMQConfigInterface) {}

  public getClientOptions(): RabbitMqClientOptionsInterface {
    if (!this.config) {
      return null;
    }

    return {
      callTimeoutMS: this.getCallTimeoutMS(),
      expireInMS: this.getExpireIn(),
      urls: this.getConnectionUrls(),
    };
  }

  public getMessageBusOptions(): MessageEncryptionOptionsInterface {
    if (!this.config || !this.config.rsa) {
      return null;
    }

    return {
      rsa: this.getMessageEncryption(),
    };
  }

  public getConnectionUrls(): string[] {
    if (!this.config) {
      return [];
    }

    return this.config.urls;
  }

  public getCallTimeoutMS(): number {
    if (!this.config) {
      return 0;
    }

    return this.config.callTimeoutMS;
  }

  public getExpireIn(): number {
    if (!this.config) {
      return 0;
    }

    return this.config.expireInMS;
  }

  public getExchanges(): RabbitMqExchangeConfigInterface[] {
    if (!this.config) {
      return [];
    }

    return this.config.exchanges;
  }

  public getExchangesName(): string[] {
    if (!this.getExchanges()) {
      return [];
    }

    return this.getExchanges().map(
      (exchange: RabbitMqExchangeConfigInterface) => exchange.name,
    );
  }

  public getQueues(): RabbitMqQueueConfigInterface[] {
    if (!this.getExchanges()) {
      return [];
    }

    return this.getExchanges().flatMap(
      (exchange: RabbitMqExchangeConfigInterface) => exchange.queues,
    );
  }

  public getQueuesNames(): string[] {
    return this.getQueues().map(
      (queue: RabbitMqQueueConfigInterface) => queue.name,
    );
  }

  public isMultipleQueue(): boolean {
    return this.getQueues().length > 1;
  }

  public getVHost(): string {
    if (!this.config) {
      return '';
    }

    return this.config.vhost;
  }

  public getManagementUrl(): string {
    if (!this.config) {
      return '';
    }

    return this.config.managementUrl;
  }

  public isGlobalPrefetchCount(): boolean {
    if (!this.config) {
      return false;
    }

    return this.config.isGlobalPrefetchCount;
  }

  public getPrefetchCount(): number {
    if (!this.config) {
      return 0;
    }

    return this.config.prefetchCount;
  }

  public getMessageEncryption(): { private: string } {
    if (!this.config) {
      return null;
    }

    return this.config.rsa;
  }

  public getMessageEncryptionPrivate(): string {
    if (!this.config) {
      return null;
    }

    if (!this.config.rsa) {
      return null;
    }

    return this.config.rsa.private;
  }
}
