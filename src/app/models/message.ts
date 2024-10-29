import { MessageType } from '../interfaces/message-type.interface';

export class Message<T extends MessageType> {
  plugin: T['plugin'];
  key: T['key'];
  value: T['value'];
}
