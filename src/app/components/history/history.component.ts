import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  history: { sender: string; text: string }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.http.get<string[]>('http://localhost:3001/api/chat/history')
      .subscribe(data => {
        this.history = data.map(msg => {
          const split = msg.split(': ');
          return { sender: split[0] === 'User' ? 'user' : 'ai', text: split.slice(1).join(': ') };
        });
      });
  }

  newConversation() {
    this.http.post('http://localhost:3001/api/chat/new', {}).subscribe(() => {
      this.history = [];
      this.router.navigate(['/chat']);
    });
  }
}
