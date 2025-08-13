import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      errorMessage = `Server error: ${error.status}. ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // PUBLIC_INTERFACE
  getAllNotes(): Observable<Note[]> {
    return this.http
      .get<Note[]>(`${this.apiUrl}/notes`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // PUBLIC_INTERFACE
  getNoteById(id: string): Observable<Note> {
    return this.http
      .get<Note>(`${this.apiUrl}/notes/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // PUBLIC_INTERFACE
  createNote(note: Omit<Note, 'id'>): Observable<Note> {
    return this.http
      .post<Note>(`${this.apiUrl}/notes`, note)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // PUBLIC_INTERFACE
  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http
      .put<Note>(`${this.apiUrl}/notes/${id}`, note)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // PUBLIC_INTERFACE
  deleteNote(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/notes/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // PUBLIC_INTERFACE
  searchNotes(query: string): Observable<Note[]> {
    return this.http
      .get<Note[]>(`${this.apiUrl}/notes/search?q=${encodeURIComponent(query)}`)
      .pipe(catchError((error) => this.handleError(error)));
  }
}
