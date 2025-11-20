import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:3001/api/documents'; // vérifier le port Spring Boot

  constructor(private http: HttpClient) {}

  uploadPDF(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload/pdf`, formData, { responseType: 'text' });
  }

  uploadCSV(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload/csv`, formData, { responseType: 'text' });
  }

  listFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/list`);
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }

  deleteFile(filename: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${filename}`, { responseType: 'text' });
  }

}
