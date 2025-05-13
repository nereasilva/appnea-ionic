import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Add welcome message
    this.messages.push({
      sender: 'bot',
      text: 'Hi there! I\'m your APPNEA Assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    // Add user message
    this.messages.push({
      sender: 'user',
      text: this.newMessage,
      timestamp: new Date()
    });

    const userMessage = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;

    // Get response from chatbot service
    this.chatbotService.getResponse(userMessage).subscribe(response => {
      this.isLoading = false;
      this.messages.push({
        sender: 'bot',
        text: response,
        timestamp: new Date()
      });
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }
}
