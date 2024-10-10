import { Injectable } from '@angular/core';
import { FrequencyEnum, KeyToNoteEnum, LfoModeEnum, NotesEnum } from '../app-enums';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  notesArray: NotesEnum[];

  constructor() {
    this.notesArray = Object.keys(NotesEnum).filter((v) => isNaN(Number(v))) as unknown as NotesEnum[];
  }

  findFrequencyValue(note: NotesEnum, corase: number) {
    const noteI = this.notesArray.indexOf(note);

    return +FrequencyEnum[this.notesArray[noteI + corase]]
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
