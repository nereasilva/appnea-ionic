import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as stringSimilarity from 'string-similarity';

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
    
    // Nuevas preguntas/respuestas
    "how is sleep apnea diagnosed?": "Diagnosis typically involves a sleep study, called a polysomnography, which monitors your breathing, oxygen levels, and other vital signs overnight.",
    "what is CPAP?": "CPAP stands for Continuous Positive Airway Pressure. It's a machine that helps keep your airways open while you sleep by delivering constant air pressure through a mask.",
    "can children have sleep apnea?": "Yes, children can also develop sleep apnea, often due to enlarged tonsils or adenoids. It can affect their behavior, sleep, and learning.",
    "what are the risk factors?": "Common risk factors include being overweight, having a large neck circumference, being male, smoking, nasal congestion, and having a family history of sleep apnea.",
    "can sleep apnea be cured?": "Sleep apnea is usually a chronic condition, but lifestyle changes and treatments like CPAP can greatly reduce symptoms. In some cases, surgery may be an option.",
    "what happens if it's not treated?": "Untreated sleep apnea can lead to high blood pressure, heart problems, stroke, diabetes, and poor concentration. It can also affect your quality of life and increase accident risk.",
    "can I use the app to track my symptoms?": "Yes, this app allows you to log symptoms, access educational material, and communicate with your doctor for better management of your condition.",
    "how do I improve my sleep quality?": "Stick to a sleep schedule, avoid alcohol and heavy meals before bed, keep your bedroom cool and dark, and consider using a CPAP if prescribed.",
    "is snoring always a sign of sleep apnea?": "Not always. Snoring can occur without sleep apnea, but loud and chronic snoring accompanied by pauses in breathing could be a sign. A sleep study is the best way to know.",
    "default": "That's an interesting question! I recommend discussing it with your doctor for personalized advice. You can use the chat feature to contact them."
  };

  constructor() {}

  // Método para obtener la respuesta más similar a la consulta del usuario
  getResponse(message: string): Observable<string> {
    const userMessage = message.trim().toLowerCase();
    
    // Buscar la respuesta más cercana utilizando similitud de cadenas
    const questionKeys = Object.keys(this.responses);
    const bestMatch = stringSimilarity.findBestMatch(userMessage, questionKeys);
    
    // Si la similitud es suficientemente alta, devolver la mejor respuesta encontrada
    const response = bestMatch.bestMatch.rating > 0.6 ? this.responses[bestMatch.bestMatch.target] : this.responses['default'];
    
    // Simula el procesamiento con un retraso
    return of(response).pipe(delay(500));
  }
}
