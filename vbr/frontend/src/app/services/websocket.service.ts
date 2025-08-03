import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<any>();

  constructor() {}

  connect(userId: string): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(environment.wsUrl, {
      query: { userId }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('notification', (data: any) => {
      this.messageSubject.next(data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket) {
      this.socket.emit('message', message);
    }
  }
}
