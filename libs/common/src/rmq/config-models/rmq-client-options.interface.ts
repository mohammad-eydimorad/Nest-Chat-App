export class RabbitMqClientOptionsInterface {
  public urls?: string[];
  public callTimeoutMS?: number = 180 * 1000;
  public expireInMS?: number = 10 * 1000;
}
