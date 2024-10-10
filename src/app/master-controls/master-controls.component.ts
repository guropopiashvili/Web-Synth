import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppService } from '../services/app.service';
import { KnobComponent } from '../components/knob/knob.component';
import { MasterParams, OscillatorParams } from '../app-types';
import { KnobType } from '../app-enums';

@Component({
  selector: 'app-master-controls',
  standalone: true,
  imports: [KnobComponent],
  templateUrl: './master-controls.component.html',
  styleUrl: './master-controls.component.scss'
})
export class MasterControlsComponent {
  @Input() masterParams!: MasterParams;

  knobType = KnobType;

  constructor(private appService: AppService) { }

  setMasterVolume(value: number) {
    this.appService.pickedPreset.getValue().masterParams.masterVolume = value;
    this.appService.updateSoundByMasterParam.next(true);
  }
  setPan(value: number) {
    this.appService.pickedPreset.getValue().masterParams.pan = value;
    this.appService.updateSoundByMasterParam.next(true);
  }
  setChorus(value: number) {
    this.appService.pickedPreset.getValue().masterParams.chorus = value;
    this.appService.updateSoundByMasterParam.next(true);
  }
}
