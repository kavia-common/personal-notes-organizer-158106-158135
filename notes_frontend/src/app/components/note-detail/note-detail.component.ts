import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="note-detail" *ngIf="editableNote">
      <div class="note-header">
        <input
          type="text"
          [(ngModel)]="editableNote.title"
          (blur)="onSave()"
          class="title-input"
          placeholder="Note title"
        />
        <button class="delete-button" (click)="onDelete()">Delete</button>
      </div>
      <textarea
        [(ngModel)]="editableNote.content"
        (blur)="onSave()"
        class="content-textarea"
        placeholder="Start typing your note..."
      ></textarea>
    </div>
    <div class="empty-state" *ngIf="!editableNote">
      <p>Select a note or create a new one</p>
    </div>
  `,
  styles: [`
    .note-detail {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .title-input {
      font-size: 24px;
      font-weight: 500;
      border: none;
      outline: none;
      width: 100%;
      margin-right: 16px;
      color: #424242;
    }

    .title-input:focus {
      border-bottom: 2px solid #1976d2;
    }

    .delete-button {
      padding: 8px 16px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .delete-button:hover {
      background-color: #d32f2f;
    }

    .content-textarea {
      flex: 1;
      padding: 16px;
      font-size: 16px;
      line-height: 1.6;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      resize: none;
      outline: none;
    }

    .content-textarea:focus {
      border-color: #1976d2;
    }

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state p {
      color: #757575;
      font-size: 18px;
    }
  `]
})
export class NoteDetailComponent implements OnChanges {
  @Input() note: Note | null = null;
  @Output() noteUpdated = new EventEmitter<Note>();
  @Output() noteDeleted = new EventEmitter<string>();

  editableNote: Note | null = null;

  ngOnChanges(): void {
    this.editableNote = this.note ? { ...this.note } : null;
  }

  onSave() {
    if (this.editableNote && this.note) {
      if (
        this.editableNote.title !== this.note.title ||
        this.editableNote.content !== this.note.content
      ) {
        this.noteUpdated.emit(this.editableNote);
      }
    }
  }

  onDelete() {
    if (this.note?.id) {
      this.noteDeleted.emit(this.note.id);
    }
  }
}
