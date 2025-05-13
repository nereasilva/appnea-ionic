import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SocketChatService {
  private socket: Socket | undefined;
  private newMessageSubject = new Subject<Message>();
  public newMessage$ = this.newMessageSubject.asObservable();
  private currentUserId: string | null = null;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => {
      if (user && user._id) {
        this.currentUserId = user._id;
        this.connect(user._id);
      } else {
        this.disconnect();
        this.currentUserId = null;
      }
    });
  }

  private getSocketUrl(): string {
    // Deriva la URL base de la apiUrl de environment
    // Si apiUrl es 'http://localhost:3000/api', la base será 'http://localhost:3000'
    const apiUrl = environment.apiUrl;
    const urlParts = apiUrl.split('/');
    return `${urlParts[0]}//${urlParts[2]}`;
  }

  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    const socketUrl = this.getSocketUrl();
    console.log(`SocketChatService: Connecting to ${socketUrl} for user ${userId}`);

    this.socket = io(socketUrl, {
      query: { userId },
      transports: ['websocket'] // Forzar websocket para evitar problemas de polling con CORS en desarrollo
    });

    this.socket.on('connect', () => {
      console.log('SocketChatService: Connected to server, socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('SocketChatService: Disconnected from server, reason:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('SocketChatService: Connection error:', error);
    });

    this.socket.on('new-message', (message: Message) => {
      console.log('SocketChatService: Received new-message event', message);
      this.newMessageSubject.next(message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('SocketChatService: Disconnecting socket');
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}
