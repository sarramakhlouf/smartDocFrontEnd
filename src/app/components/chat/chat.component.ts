import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userInput = '';
  messages: { sender: string; text: string }[] = [];
  historySidebar: string[] = [];
  conversations: { title: string, messages: { question: string, answer: string }[] }[] = [];
  selectedConversationIndex: number | null = null;

  constructor(private chatService: ChatService, private http: HttpClient) {}

  ngOnInit() {
    this.loadHistory();
  }

  // Charger l'historique depuis le backend
  loadHistory() {
    this.http.get<string[]>('http://localhost:3001/api/chat/history').subscribe(data => {
      let currentConversation: { question: string, answer: string }[] = [];
      let tempQuestion = '';
      let count = 1;
      this.conversations = [];
      this.historySidebar = [];

      data.forEach(msg => {
        const split = msg.split(': ');
        if (split.length < 2) return;

        const sender = split[0];
        const text = split.slice(1).join(': ');

        if (sender === 'User') {
          tempQuestion = text;
        } else if (sender === 'Agent') {
          if (tempQuestion) {
            currentConversation.push({ question: tempQuestion, answer: text });
            tempQuestion = '';
          }
        }
      });

      // Si la conversation n'est pas vide
      if (currentConversation.length > 0) {
        this.conversations.push({ title: `Conversation ${count}`, messages: [...currentConversation] });
        this.historySidebar.push(`Conversation ${count}`);
      }
    });
  }

  // Envoyer un message depuis l'input utilisateur
  sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    // Ajouter à la conversation actuelle
    let newMsg = { question: trimmedInput, answer: '' };
    if (this.selectedConversationIndex !== null) {
      this.conversations[this.selectedConversationIndex].messages.push(newMsg);
    }

    this.messages.push({ sender: 'user', text: trimmedInput });

    this.chatService.sendQuery(trimmedInput).subscribe({
      next: (res) => {
        const aiMsg = { sender: 'ai', text: res };
        this.messages.push(aiMsg);

        if (this.selectedConversationIndex !== null) {
          let conv = this.conversations[this.selectedConversationIndex];
          conv.messages[conv.messages.length - 1].answer = res;
        }
      },
      error: () => {
        const aiMsg = { sender: 'ai', text: 'Erreur lors de la réponse de l’agent.' };
        this.messages.push(aiMsg);
      }
    });

    this.userInput = '';
  }

  // Commencer une nouvelle conversation
  newConversation() {
    this.http.post('http://localhost:3001/api/chat/new', {}).subscribe(() => {
      this.messages = [];
    });
  }

  // Supprimer l'historique
  clearHistory() {
    this.http.post('http://localhost:3001/api/chat/new', {}).subscribe(() => {
      this.conversations = [];
      this.historySidebar = [];
      this.selectedConversationIndex = null;
    });
  }

  // Sélectionner une conversation depuis la sidebar
  selectConversation(index: number) {
    this.selectedConversationIndex = index;
    const conv = this.conversations[index];
    this.messages = [];
    conv.messages.forEach(m => {
      this.messages.push({ sender: 'user', text: m.question });
      this.messages.push({ sender: 'ai', text: m.answer });
    });
  }
}
