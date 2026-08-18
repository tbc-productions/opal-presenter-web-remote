import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject, Subscription } from 'rxjs';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { OpenLPService } from './openlp.service';
import { SentenceCasePipe } from '../pipes/sentence-case.pipe';
import { Message } from '../models/message';
import { MessageType } from '../interfaces/message-type.interface';
import * as websocketModule from '../openlp-websocket';
import * as utilsModule from '../utils';

vi.mock('../openlp-websocket');
vi.mock('../utils');

describe('OpenLPService', () => {
  let service: OpenLPService;

  beforeEach(() => {
    vi.mocked(websocketModule.createWebSocket).mockReturnValue(new Subject() as any);
    vi.mocked(utilsModule.deserialize).mockReturnValue({} as any);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        OpenLPService,
        {
          provide: HttpClient,
          useValue: {
            get: vi.fn().mockReturnValue(of({ websocket_port: 8080 })),
            post: vi.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: vi.fn(),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: vi.fn(),
          },
        },
        {
          provide: TitleCasePipe,
          useValue: {
            transform: vi.fn((val) => val),
          },
        },
        {
          provide: SentenceCasePipe,
          useValue: {
            transform: vi.fn((val) => val),
          },
        },
        {
          provide: TranslateService,
          useValue: {
            stream: vi.fn().mockReturnValue(of('')),
          },
        },
      ],
    });

    service = TestBed.inject(OpenLPService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createMessageWebsocketConnection', () => {
    it('should unsubscribe from existing message websocket subscription before creating a new one', () => {
      const mockSubscription = new Subscription();
      const unsubscribeSpy = vi.spyOn(mockSubscription, 'unsubscribe');
      service['_messageWebSocketSubscription'] = mockSubscription;

      const mockSubject = new Subject<Message<MessageType>>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      service['createMessageWebsocketConnection'](8080);

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should create a new message websocket connection with correct parameters', () => {
      const mockSubject = new Subject<Message<MessageType>>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );
      const deserializeSpy = vi.fn();
      vi.mocked(utilsModule.deserialize).mockImplementation(deserializeSpy);

      service['host'] = 'localhost';
      service['createMessageWebsocketConnection'](8080);

      expect(websocketModule.createWebSocket).toHaveBeenCalledWith(
        'localhost',
        8080,
        expect.any(Function),
        'messages'
      );
    });

    it('should assign the new subscription to _messageWebSocketSubscription', () => {
      const mockSubject = new Subject<Message<MessageType>>();
      const subscribeSpy = vi.spyOn(mockSubject, 'subscribe');
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      service['createMessageWebsocketConnection'](8080);

      expect(subscribeSpy).toHaveBeenCalled();
      expect(service['_messageWebSocketSubscription']).toBeDefined();
    });

    it('should call handleMessage when a message is received', () => {
      const handleMessageSpy = vi.spyOn(service, 'handleMessage');
      const mockSubject = new Subject<Message<MessageType>>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      service['createMessageWebsocketConnection'](8080);

      const testMessage: Message<MessageType> = {
        plugin: 'test-plugin',
        key: 'test-key',
        value: {},
      };

      mockSubject.next(testMessage);

      expect(handleMessageSpy).toHaveBeenCalledWith(testMessage);
    });

    it('should call reconnectWebSocket on websocket error', () => {
      const reconnectSpy = vi.spyOn(service, 'reconnectWebSocket' as any);
      const mockSubject = new Subject<Message<MessageType>>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      service['createMessageWebsocketConnection'](8080);

      mockSubject.error(new Error('Connection failed'));

      expect(reconnectSpy).toHaveBeenCalled();
    });

    it('should call reconnectWebSocket on websocket complete', () => {
      const reconnectSpy = vi.spyOn(service, 'reconnectWebSocket' as any);
      const mockSubject = new Subject<Message<MessageType>>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      service['createMessageWebsocketConnection'](8080);

      mockSubject.complete();

      expect(reconnectSpy).toHaveBeenCalled();
    });

    it('should call deserialize with correct parameters for each message', () => {
      const mockMessage = '{"plugin":"test","key":"test-key","value":{}}'; // JSON string input
      const deserializeSpy = vi
        .mocked(utilsModule.deserialize)
        .mockReturnValue({ plugin: 'test', key: 'test-key', value: {} } as any);
      const mockSubject = new Subject<any>();
      vi.mocked(websocketModule.createWebSocket).mockReturnValue(
        mockSubject as any
      );

      // Clear call history from initialization
      deserializeSpy.mockClear();
      vi.mocked(websocketModule.createWebSocket).mockClear();

      service['createMessageWebsocketConnection'](8080);

      // Get the deserialize function that was passed to createWebSocket
      const createWebSocketMock = vi.mocked(websocketModule.createWebSocket);
      const deserializeFunction = createWebSocketMock.mock.calls[0][2];

      deserializeFunction(mockMessage);

      expect(deserializeSpy).toHaveBeenCalledWith(mockMessage, expect.anything());
    });

    it('should handle multiple sequential calls correctly', () => {
      const mockSubject1 = new Subject<Message<MessageType>>();
      const mockSubject2 = new Subject<Message<MessageType>>();

      vi.mocked(websocketModule.createWebSocket)
        .mockReturnValueOnce(mockSubject1 as any)
        .mockReturnValueOnce(mockSubject2 as any);

      // First call
      service['createMessageWebsocketConnection'](8080);
      const firstSubscription = service['_messageWebSocketSubscription'];

      // Second call should unsubscribe from the first
      const unsubscribeSpy = vi.spyOn(firstSubscription, 'unsubscribe');
      service['createMessageWebsocketConnection'](8080);

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(service['_messageWebSocketSubscription']).not.toBe(
        firstSubscription
      );
    });
  });

  describe('handleMessage', () => {
    it('should emit the message through messageReceived$ event emitter', async () => {
      const testMessage: Message<MessageType> = {
        plugin: 'test-plugin',
        key: 'test-key',
        value: {},
      };

      let receivedMessage: Message<MessageType> | undefined;
      service.messageReceived$.subscribe((message) => {
        receivedMessage = message;
      });

      service.handleMessage(testMessage);

      expect(receivedMessage).toEqual(testMessage);
    });
  });
});
