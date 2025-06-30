import { Injectable } from '@angular/core';
import { NotesEnum } from '../app-enums';
import { BehaviorSubject, Subject } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  pressedKeys: BehaviorSubject<NotesEnum[]> = new BehaviorSubject<NotesEnum[]>([]);
  keyAdded: Subject<NotesEnum> = new Subject();
  keyRemoved: Subject<NotesEnum> = new Subject();

  constructor(private helperService: HelperService) { }

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

  handleMidiEvent(command: number, note: number, velocity: number) {
    const noteEnum = this.helperService.midiToNoteEnum(note);
    if (!noteEnum) {
      return;
    }

    // Check if it's a Note On message (0x90-0x9F) with velocity > 0
    if (((command & 0xF0) === 0x90) && velocity > 0) {
      this.addNote(noteEnum);
    // Check if it's a Note Off message (0x80-0x8F) or a Note On with velocity 0
    } else if (((command & 0xF0) === 0x80) || (((command & 0xF0) === 0x90) && velocity === 0)) {
      this.removeNote(noteEnum);
    }
  }
}
