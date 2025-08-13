import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { Note } from './models/note.model';
import { NotesService } from './services/notes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NotesListComponent, NoteDetailComponent],
  template: `
    <div class="app-container">
      <aside class="sidebar">
        <app-notes-list
          [notes]="notes"
          [selectedNoteId]="selectedNoteId"
          (noteSelected)="onNoteSelected($event)"
          (searchQuery)="onSearch($event)"
        ></app-notes-list>
        @if (errorMessage) {
          <div class="error-message">
            {{ errorMessage }}
          </div>
        }
      </aside>
      <main class="main-content">
        <app-note-detail
          [note]="selectedNote"
          (noteUpdated)="onNoteUpdated($event)"
          (noteDeleted)="onNoteDeleted($event)"
        ></app-note-detail>
      </main>
      <button class="fab" (click)="onCreateNew()">+</button>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #ffffff;
    }

    .sidebar {
      width: 300px;
      background-color: #f5f5f5;
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    .fab {
      position: fixed;
      right: 30px;
      bottom: 30px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #1976d2;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s;
    }

    .fab:hover {
      background-color: #1565c0;
    }

    .error-message {
      padding: 16px;
      margin: 16px;
      background-color: #ffebee;
      color: #c62828;
      border-radius: 4px;
      font-size: 14px;
    }
  `]
})
export class AppComponent implements OnInit {
  private readonly notesService = inject(NotesService);

  notes: Note[] = [];
  selectedNoteId: string | null = null;
  selectedNote: Note | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadNotes();
  }

  private clearError(): void {
    this.errorMessage = null;
  }

  private handleApiError(error: Error): void {
    this.errorMessage = error.message || 'An unexpected error occurred';
  }

  loadNotes(): void {
    this.clearError();
    this.notesService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        if (this.selectedNoteId) {
          this.selectedNote = notes.find(note => note.id === this.selectedNoteId) || null;
        }
      },
      error: (error: Error) => this.handleApiError(error)
    });
  }

  onNoteSelected(noteId: string): void {
    this.clearError();
    this.selectedNoteId = noteId;
    this.notesService.getNoteById(noteId).subscribe({
      next: (note) => {
        this.selectedNote = note;
      },
      error: (error: Error) => this.handleApiError(error)
    });
  }

  onSearch(query: string): void {
    this.clearError();
    if (query.trim()) {
      this.notesService.searchNotes(query).subscribe({
        next: (notes) => {
          this.notes = notes;
        },
        error: (error: Error) => this.handleApiError(error)
      });
    } else {
      this.loadNotes();
    }
  }

  onNoteUpdated(note: Note): void {
    this.clearError();
    if (note.id) {
      this.notesService.updateNote(note.id, note).subscribe({
        next: (updatedNote) => {
          this.selectedNote = updatedNote;
          this.loadNotes();
        },
        error: (error: Error) => this.handleApiError(error)
      });
    }
  }

  onNoteDeleted(noteId: string): void {
    this.clearError();
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        this.selectedNote = null;
        this.selectedNoteId = null;
        this.loadNotes();
      },
      error: (error: Error) => this.handleApiError(error)
    });
  }

  onCreateNew(): void {
    this.clearError();
    const newNote: Omit<Note, 'id'> = {
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notesService.createNote(newNote).subscribe({
      next: (createdNote) => {
        if (createdNote.id) {
          this.selectedNote = createdNote;
          this.selectedNoteId = createdNote.id;
          this.loadNotes();
        }
      },
      error: (error: Error) => this.handleApiError(error)
    });
  }
}
