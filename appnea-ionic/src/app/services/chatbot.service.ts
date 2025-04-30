import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private responses: Record<string, string> = {
    "hello": "Hi there! How can I help you today?",
    "hi": "Hello! Ask me about sleep apnea.",
    "what is sleep apnea?": "Sleep apnea is a sleep disorder where breathing repeatedly stops and starts. Common signs include loud snoring and feeling tired even after a full night's sleep.",
    "tell me about treatment": "Common treatments include lifestyle changes (like weight loss), using a CPAP machine, or other breathing devices. Your doctor can recommend the best approach for you.",
    "what are common symptoms?": "Loud snoring, episodes where you stop breathing during sleep (witnessed by another person), gasping for air during sleep, morning headache, difficulty staying asleep (insomnia), excessive daytime sleepiness (hypersomnia), difficulty paying attention while awake, irritability.",
    "default": "That's an interesting question! I recommend discussing it with your doctor for personalized advice. You can use the chat feature to contact them."
  };

  constructor() {}

  // Get a response from the chatbot
  getResponse(message: string): Observable<string> {
    const userMessage = message.trim().toLowerCase();
    const response = this.responses[userMessage] || this.responses['default'];
    
    // Add a small delay to simulate processing
    return of(response).pipe(delay(500));
  }
}
