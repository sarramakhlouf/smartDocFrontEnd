import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  // URL de ton backend Spring Boot
  private baseUrl = 'http://localhost:3001/api/stats';

  constructor(private http: HttpClient) { }

  getStatsFromText(text: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/text`, { text });
  }

  getStatsFromNumbers(numbers: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/numbers`, { numbers });
  }
}
