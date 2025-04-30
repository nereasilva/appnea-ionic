import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() otherUserId: string | null = null;
  @Input() otherUserName: string = '';
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;

  currentUser: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  isLoading = false;
  error: string | null = null;

  private userSubscription: Subscription | undefined;
  private messageSubscription: Subscription | undefined;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.messageService.initSocket(user._id);
        this.listenForNewMessages();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messageService.disconnectSocket();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  listenForNewMessages() {
    this.messageSubscription = this.messageService.onNewMessage().subscribe(message => {
      // Only add the message if it's from the current chat
      if (this.otherUserId && 
          (message.senderId === this.otherUserId || message.receiverId === this.otherUserId)) {
        this.messages.push(message);
      }
    });
  }

  loadMessages() {
    if (!this.otherUserId) {
      return;
    }

    this.isLoading = true;
    this.messageService.getMessages(this.otherUserId).subscribe({
      next: messages => {
        this.messages = messages;
        this.isLoading = false;
        this.error = null;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: err => {
        console.error('Error loading messages:', err);
        this.isLoading = false;
        this.error = 'Failed to load messages. Please try again.';
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.otherUserId) {
      return;
    }

    this.messageService.sendMessage(this.otherUserId, this.newMessage).subscribe({
      next: message => {
        this.messages.push(message);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: err => {
        console.error('Error sending message:', err);
        this.error = 'Failed to send message. Please try again.';
      }
    });
  }
}
