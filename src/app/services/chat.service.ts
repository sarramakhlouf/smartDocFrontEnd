import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:3001/api/chat/query';

  constructor(private http: HttpClient) {}

  sendQuery(msg: string): Observable<string> {
    const payload = { question: msg };
    console.log('Payload envoyé au backend:', payload);
    return this.http.post(this.baseUrl, payload, { responseType: 'text' });
  }

}
