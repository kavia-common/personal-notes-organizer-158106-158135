import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-list-container">
      <div class="search-container">
        <input
          type="text"
          [(ngModel)]="searchText"
          (input)="onSearchChange()"
          placeholder="Search notes..."
          class="search-input"
        />
      </div>
      <div class="notes-list">
        @for (note of notes; track note.id) {
          <div
            class="note-item"
            [class.selected]="note.id === selectedNoteId"
            (click)="onNoteClick(note.id!)"
          >
            <h3>{{ note.title }}</h3>
            <p>{{ getPreviewText(note.content) }}</p>
            <small>{{ note.updatedAt | date:'short' }}</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notes-list-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .search-container {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
    }

    .search-input:focus {
      border-color: #1976d2;
    }

    .notes-list {
      flex: 1;
      overflow-y: auto;
    }

    .note-item {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .note-item:hover {
      background-color: #f0f0f0;
    }

    .note-item.selected {
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
    }

    .note-item h3 {
      margin: 0 0 8px;
      color: #424242;
      font-size: 16px;
    }

    .note-item p {
      margin: 0 0 8px;
      color: #757575;
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-item small {
      color: #9e9e9e;
      font-size: 12px;
    }
  `]
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: string | null = null;
  @Output() noteSelected = new EventEmitter<string>();
  @Output() searchQuery = new EventEmitter<string>();

  searchText = '';

  onNoteClick(noteId: string) {
    this.noteSelected.emit(noteId);
  }

  onSearchChange() {
    this.searchQuery.emit(this.searchText);
  }

  getPreviewText(content: string): string {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  }
}
