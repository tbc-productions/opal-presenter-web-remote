import { MessageType } from '../interfaces/message-type.interface';

export class Message<T extends MessageType> {
  plugin: T['plugin'] = '' as T['plugin'];
  key: T['key'] = '' as T['key'];
  value: T['value'] = '' as T['value'];
}
