import { Component, Input } from '@angular/core';
import { KnobComponent } from '../components/knob/knob.component';
import { CommonModule } from '@angular/common';
import { KnobType, LfoModeEnum } from '../app-enums';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-lfo',
  standalone: true,
  imports: [CommonModule, KnobComponent],
  templateUrl: './lfo.component.html',
  styleUrl: './lfo.component.scss'
})
export class LfoComponent {
  knobType = KnobType;

  @Input() lfoMode!: LfoModeEnum;
  @Input() lfoRate!: number;
  @Input() lfoAmplitude!: number;


  constructor(private appService: AppService) { }

  setLfoMode(value: LfoModeEnum) {
    this.appService.pickedPreset.getValue().lfoParams.mode = value;
  }

  setLfoOscillatorType(value: number) {
    this.appService.pickedPreset.getValue().lfoParams.oscillatorType = value;
    this.appService.updateSoundByLfoParam.next(true);
  }
  setLfoRate(value: number) {
    this.appService.pickedPreset.getValue().lfoParams.rate = value;
    this.appService.updateSoundByLfoParam.next(true);
  }
  setLfoAmplitude(value: number) {
    this.appService.pickedPreset.getValue().lfoParams.amplitude = value;
    this.appService.updateSoundByLfoParam.next(true);
  }
}
