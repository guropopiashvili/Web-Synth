import { Injectable } from '@angular/core';
import { NotesEnum } from '../app-enums';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  pressedKeys: BehaviorSubject<NotesEnum[]> = new BehaviorSubject<NotesEnum[]>([]);
  keyAdded: Subject<NotesEnum> = new Subject();
  keyRemoved: Subject<NotesEnum> = new Subject();

  constructor() { }

  addNote(note: NotesEnum) {
    let currentlyPressedKeys = this.pressedKeys.getValue();
    let noteIndex = currentlyPressedKeys.indexOf(note);

    if (noteIndex !== -1) {
      currentlyPressedKeys.splice(noteIndex, 1);
      this.keyRemoved.next(note);
    }

    this.pressedKeys.next([...currentlyPressedKeys, note]);
    this.keyAdded.next(note);
  }

  removeNote(note: NotesEnum) {
    let currentlyPressedKeys = this.pressedKeys.getValue();
    let noteIndex = currentlyPressedKeys.indexOf(note);

    if (noteIndex !== -1) {
      currentlyPressedKeys.splice(noteIndex, 1);
      this.pressedKeys.next([...currentlyPressedKeys]);
      this.keyRemoved.next(note);
    }
  }

  removeAllNotes() {
    let currentlyPressedKeys = this.pressedKeys.getValue();
    for (const key of currentlyPressedKeys) {
      this.keyRemoved.next(key);
    }
    this.pressedKeys.next([]);
  }
}
