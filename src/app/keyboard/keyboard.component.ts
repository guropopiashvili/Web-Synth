import { Component, HostListener, Input, OnInit } from '@angular/core';
import { KeyToNoteEnum, NotesEnum } from '../app-enums';
import { CommonModule } from '@angular/common';
import { NotesService } from '../services/notes.service';
import { HelperService } from '../services/helper.service';
import { AppService } from '../services/app.service';
import { Preset } from '../app-types';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {
  octaveStart!: number;
  keys: NotesEnum[] = [];
  pressedKeys: NotesEnum[] = [];
  notePlayedByMouse: NotesEnum | null = null;
  notesArray: NotesEnum[] = this.helperService.notesArray;


  constructor(private notesService: NotesService, private helperService: HelperService, private appService: AppService) {
    this.notesService.pressedKeys.subscribe((pressedKeys: NotesEnum[]) => this.pressedKeys = pressedKeys);

    this.appService.pickedPreset.subscribe((preset: Preset) => {
      this.octaveStart = preset.startingOctave;
      this.populateKeys();
    });
  }

  populateKeys() {
    const keys: NotesEnum[] = [];
    for (let index = 12 * this.octaveStart; index < 12 * this.octaveStart + 24; index++) {
      keys.push(this.notesArray[index]);
    }
    this.keys = keys;
  }

  onMouseDown(note: NotesEnum) {
    this.notePlayedByMouse = note;
    this.notesService.addNote(this.notePlayedByMouse);
  }

  onMouseEnter(note: NotesEnum) {
    if (this.notePlayedByMouse) {
      this.notesService.removeNote(this.notePlayedByMouse);
      this.notePlayedByMouse = note;
      this.notesService.addNote(this.notePlayedByMouse);
    }
  }

  cancelMouseClickedNote() {
    if (this.notePlayedByMouse) {
      this.notesService.removeNote(this.notePlayedByMouse);
    }
    this.notePlayedByMouse = null;
  }

  transpose(octaveStart: number) {
    if (octaveStart < 2 || octaveStart > 5) {
      return
    }
    this.octaveStart = octaveStart;
    this.appService.pickedPreset.value.startingOctave = octaveStart;
    this.populateKeys();
    this.notesService.removeAllNotes();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // prevent repeated event fire
    if (event.repeat) {
      return
    }
    // only allow to play notes that are corresponded to the keyboard
    if (this.helperService.canPlayFromKeyboard(event.code)) {
      this.notesService.addNote(this.notesArray[KeyToNoteEnum[event.code as keyof typeof KeyToNoteEnum] + 12 * this.octaveStart - 1]);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (this.helperService.canPlayFromKeyboard(event.code)) {
      this.notesService.removeNote(this.notesArray[KeyToNoteEnum[event.code as keyof typeof KeyToNoteEnum] + 12 * this.octaveStart - 1]);
    }
  }
}