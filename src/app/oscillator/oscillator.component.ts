import { Component, Input } from '@angular/core';
import { KnobComponent } from '../components/knob/knob.component';
import { OscillatorParams } from '../app-types';
import { AppService } from '../services/app.service';
import { EnvelopeVisualizerComponent } from '../components/envelope-visualizer/envelope-visualizer.component';
import { KnobType } from '../app-enums';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oscillator',
  standalone: true,
  imports: [CommonModule, KnobComponent, EnvelopeVisualizerComponent],
  templateUrl: './oscillator.component.html',
  styleUrl: './oscillator.component.scss'
})
export class OscillatorComponent {
  @Input() id!: number;
  @Input() params!: OscillatorParams;

  knobType = KnobType;

  constructor(private appService: AppService) { }

  toggleOscillator(id: number) {
    if (id === 0) { return }
    this.appService.pickedPreset.getValue().oscParams[this.id].isActive = !this.appService.pickedPreset.getValue().oscParams[this.id].isActive;
  }

  setOscillatorType(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].oscillatorType = value;
    this.appService.updateSoundByOscParam.next(true);
  }

  setAttack(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].attack = value;
  }

  setDecay(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].decay = value;
  }

  setSustain(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].sustain = value;
  }

  setRelease(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].release = value;
  }

  setCoarse(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].coarse = value;
    this.appService.updateSoundByOscParam.next(true);
  }

  setVolume(value: number) {
    this.appService.pickedPreset.getValue().oscParams[this.id].volume = value;
    this.appService.updateSoundByOscParam.next(true);
  }
}