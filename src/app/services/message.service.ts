import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';

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

  constructor(private http: HttpClient) {}

  // Initialize socket connection
  initSocket(userId: string) {
    if (!this.socket) {
      this.socket = io(environment.apiUrl, {
        query: { userId }
      });
    }
  }

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for new messages
  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      if (this.socket) {
        this.socket.on('new-message', (message: Message) => {
          observer.next(message);
        });
      }

      return () => {
        if (this.socket) {
          this.socket.off('new-message');
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
