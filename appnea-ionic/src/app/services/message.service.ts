import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { PlatformConfigService } from './platform-config.service';

// Interface to match the API response format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket: Socket | null = null;

  constructor(
    private http: HttpClient,
    private platformConfigService: PlatformConfigService
  ) {}

  private getSocketUrl(): string {
    const apiUrl = environment.apiUrl;
    if (apiUrl === 'placeholder-will-be-replaced-at-runtime') {
      console.warn('MessageService: environment.apiUrl is still placeholder. Socket connection might use an incorrect or default URL.');
    }
    const urlParts = apiUrl.split('/'); 
    if (urlParts.length < 3) {
        console.error('MessageService: Invalid apiUrl format for deriving socket URL:', apiUrl);
        return 'http://localhost:3000'; 
    }
    return `${urlParts[0]}//${urlParts[2]}`; 
  }

  // Initialize socket connection
  initSocket(userId: string) {
    if (this.socket?.connected && (this.socket.io.opts.query as any)?.userId === userId) {
      console.log('MessageService: Socket already connected for user', userId);
      return;
    }
    if (this.socket) {
        this.disconnectSocket();
    }

    const socketUrl = this.getSocketUrl();
    console.log(`MessageService: Initializing socket connection to ${socketUrl} for user ${userId}`);

    this.socket = io(socketUrl, { 
      query: { userId },
      transports: ['websocket'] 
    });

    this.socket.on('connect', () => {
      console.log('MessageService: Socket connected successfully. Socket ID:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('MessageService: Socket disconnected. Reason:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('MessageService: Socket connection error:', error);
    });
  }

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      console.log('MessageService: Disconnecting socket.');
      this.socket.off('new-message');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.socket.off('connect_error');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for new messages
  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      if (!this.socket) {
        console.warn('MessageService: Socket not initialized when trying to listen for new messages.');
        observer.complete(); 
        return;
      }

      const messageHandler = (message: Message) => {
        console.log('MessageService: Received new-message via socket:', message);
        observer.next(message);
      };

      this.socket.on('new-message', messageHandler);

      return () => {
        if (this.socket) {
          console.log('MessageService: Removing new-message listener from socket.');
          this.socket.off('new-message', messageHandler);
        }
      };
    });
  }

  // Get messages between current user and another user
  getMessages(otherUserId: string): Observable<Message[]> {
    return this.http.get<ApiResponse<Message[]>>(`${environment.apiUrl}/messages/${otherUserId}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Send a message to another user
  sendMessage(receiverId: string, content: string): Observable<Message> {
    return this.http.post<ApiResponse<Message>>(`${environment.apiUrl}/messages`, {
      receiverId,
      content
    }).pipe(
      map(response => response.data)
    );
  }
}
