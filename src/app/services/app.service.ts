import { Injectable } from '@angular/core';
import { Preset } from '../app-types';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotesService } from './notes.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  presets: Preset[] = [
    { "name": "Default", "startingOctave": 3, "masterParams": { "chorus": 0, "masterVolume": 100, "pan": 50 }, "lfoParams": { "oscillatorType": 0, "mode": 0, "rate": 0, "amplitude": 0 }, "filterParams": { "attack": 0, "decay": 1, "sustain": 100, "release": 0, "cutoff": 100 }, "oscParams": [{ "id": 0, "oscillatorType": 0, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": true }, { "id": 1, "oscillatorType": 40, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": false }, { "id": 2, "oscillatorType": 70, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": false }] },
    { "name": "Piano", "startingOctave": 3, "masterParams": { "chorus": 68, "masterVolume": 100, "pan": 50 }, "lfoParams": { "oscillatorType": 19, "mode": 1, "rate": 0, "amplitude": 0 }, "filterParams": { "attack": 0, "decay": 19, "sustain": 6, "release": 0, "cutoff": 52 }, "oscParams": [{ "id": 0, "oscillatorType": 0, "volume": 50, "attack": 3, "decay": 20, "sustain": 0, "release": 17, "coarse": 50, "lfoAmplitude": 0, "isActive": true }, { "id": 1, "oscillatorType": 0, "volume": 50, "attack": 7, "decay": 34, "sustain": 0, "release": 20, "coarse": 77, "lfoAmplitude": 0, "isActive": true }, { "id": 2, "oscillatorType": 0, "volume": 6, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 25, "lfoAmplitude": 0, "isActive": false }] },
    { "name": "Organ", "startingOctave": 3, "masterParams": { "chorus": 0, "masterVolume": 100, "pan": 50 }, "lfoParams": { "oscillatorType": 19, "mode": 1, "rate": 26, "amplitude": 7 }, "filterParams": { "attack": 0, "decay": 1, "sustain": 100, "release": 0, "cutoff": 12 }, "oscParams": [{ "id": 0, "oscillatorType": 0, "volume": 100, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 36, "lfoAmplitude": 0, "isActive": true }, { "id": 1, "oscillatorType": 42, "volume": 13, "attack": 0, "decay": 5, "sustain": 53, "release": 1, "coarse": 75, "lfoAmplitude": 0, "isActive": true }, { "id": 2, "oscillatorType": 0, "volume": 8, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 100, "lfoAmplitude": 0, "isActive": true }] },
    { "name": "Bass", "startingOctave": 3, "masterParams": { "chorus": 0, "masterVolume": 100, "pan": 50 }, "lfoParams": { "oscillatorType": 0, "mode": 1, "rate": 0, "amplitude": 0 }, "filterParams": { "attack": 0, "decay": 1, "sustain": 1, "release": 0, "cutoff": 100 }, "oscParams": [{ "id": 0, "oscillatorType": 52, "volume": 33, "attack": 14, "decay": 5, "sustain": 0, "release": 5, "coarse": 0, "lfoAmplitude": 0, "isActive": true }, { "id": 1, "oscillatorType": 20, "volume": 100, "attack": 0, "decay": 10, "sustain": 0, "release": 1, "coarse": 0, "lfoAmplitude": 0, "isActive": true }, { "id": 2, "oscillatorType": 54, "volume": 38, "attack": 0, "decay": 1, "sustain": 5, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": false }] },
    { "name": "Telephone", "startingOctave": 5, "masterParams": { "chorus": 0, "masterVolume": 100, "pan": 50 }, "lfoParams": { "oscillatorType": 98, "mode": 1, "rate": 47, "amplitude": 96 }, "filterParams": { "attack": 0, "decay": 1, "sustain": 100, "release": 0, "cutoff": 100 }, "oscParams": [{ "id": 0, "oscillatorType": 99, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": true }, { "id": 1, "oscillatorType": 40, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": false }, { "id": 2, "oscillatorType": 70, "volume": 50, "attack": 0, "decay": 1, "sustain": 100, "release": 1, "coarse": 50, "lfoAmplitude": 0, "isActive": false }] }
  ];

  pickedPreset: BehaviorSubject<Preset> = new BehaviorSubject(this.presets[0]);
  updateSoundByOscParam: Subject<boolean> = new Subject();
  updateSoundByLfoParam: Subject<boolean> = new Subject();
  updateSoundByFilterParam: Subject<boolean> = new Subject();
  updateSoundByMasterParam: Subject<boolean> = new Subject();

  constructor(private notesService: NotesService) { }

  pickPreset(preset: Preset) {
    this.pickedPreset.next(preset);
    this.notesService.removeAllNotes();
    // console.log(JSON.stringify(this.pickedPreset.getValue()));
  }
}