import { Injectable } from '@angular/core';
import { FrequencyEnum, KeyToNoteEnum, LfoModeEnum, NotesEnum } from '../app-enums';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  notesArray: NotesEnum[];

  constructor() {
    this.notesArray = Object.values(NotesEnum).filter((v) => typeof v === 'number') as NotesEnum[];
  }

  midiToNoteEnum(midiNote: number): NotesEnum | undefined {
    const noteName = this.midiToNoteName(midiNote);
    const noteKey = Object.keys(NotesEnum).find(key => key === noteName);
    if (noteKey) {
      return NotesEnum[noteKey as keyof typeof NotesEnum];
    }
    return undefined;
  }

  midiToNoteName(midiNote: number): string {
    const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return noteNames[noteIndex] + octave;
  }

  findFrequencyValue(note: NotesEnum, corase: number) {
    const noteI = this.notesArray.indexOf(note);

    const targetNoteNumericValue = this.notesArray[noteI + corase];

    const targetNoteName = NotesEnum[targetNoteNumericValue] as keyof typeof FrequencyEnum;

    const frequency = FrequencyEnum[targetNoteName];
    return frequency;
  }

  canPlayFromKeyboard(keyCode: string): boolean {
    return KeyToNoteEnum[keyCode as keyof typeof KeyToNoteEnum] ? true : false;
  }

  knobValueToOscType(value: number): OscillatorType {
    const nv = Math.round(value / 30);
    let oscType: OscillatorType = nv === 0 ? "sine" : nv === 1 ? "triangle" : nv === 2 ? "sawtooth" : "square";

    return oscType;
  }

  knobValueToAttack(value: number): number {
    return value / 100;
  }

  knobValueToDecay(value: number): number {
    return value / 100;
  }

  knobValueToSustain(value: number): number {
    return value / 100;
  }

  knobValueToRelease(value: number): number {
    return value / 100;
  }

  knobValueToCoarse(value: number): number {
    return Math.floor((value - 50) * 48 / 100);
  }

  knobValueToVolume(value: number): number {
    return value / 200;
  }

  knobValueToLfoRate(value: number): number {
    return value / 5;
  }

  knobValueToLfoAmplitude(value: number, lfoMode: LfoModeEnum, oscGainValue: number): number {
    if (lfoMode === 0) {
      return oscGainValue * value / 200;
    } else {
      return value * value / 50;
    }
  }

  knobValueToFilterCutoff(value: number): number {
    return 240 / 2 * value;
  }

  knobValueToFilterEnvelope(value: number): number {
    return value * 10;
  }

  knobValueToFilterAttack(value: number): number {
    return value / 50;
  }

  knobValueToFilterDecay(value: number): number {
    return value / 50;
  }

  knobValueToFilterSustain(value: number, cutoff: number): number {
    return cutoff * value / 100;
  }

  knobValueToFilterRelease(value: number): number {
    return value / 50;
  }

  knobValueToChorus(value: number): number {
    return value / 200000;
  }

  knobValueToPan(value: number): number {
    return value / 50 - 1;
  }



  // oscTypeToKnobValue(value: OscillatorType): number {
  //   let percentage: number = value === "sine" ? 0 : value === "triangle" ? 33 : value === "sawtooth" ? 66 : 100;

  //   return percentage;
  // }
}
