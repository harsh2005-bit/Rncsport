import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  Content,
} from '@google/generative-ai';

@Injectable()
export class GoogleAiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  onModuleInit() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_AI_API_KEY is not set in environment variables');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // You can choose different models like 'gemini-1.5-flash' or 'gemini-1.5-pro'
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error(
        'Google AI Model not initialized. Check GOOGLE_AI_API_KEY.',
      );
    }
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content from Google AI:', error);
      throw error;
    }
  }

  startChat(history: Content[]): ChatSession {
    if (!this.model) {
      throw new Error('Google AI Model not initialized.');
    }
    return this.model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }
}
