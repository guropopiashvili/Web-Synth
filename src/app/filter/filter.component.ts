import { Component, Input } from '@angular/core';
import { KnobComponent } from '../components/knob/knob.component';
import { CommonModule } from '@angular/common';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, KnobComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() attack!: number;
  @Input() decay!: number;
  @Input() sustain!: number;
  @Input() release!: number;
  @Input() cutoff!: number;

  constructor(private appService: AppService) { }

  setFilterAttack(value: number) {
    this.appService.pickedPreset.getValue().filterParams.attack = value;
  }
  setFilterDecay(value: number) {
    this.appService.pickedPreset.getValue().filterParams.decay = value;
  }
  setFilterSustain(value: number) {
    this.appService.pickedPreset.getValue().filterParams.sustain = value;
  }
  setFilterRelease(value: number) {
    this.appService.pickedPreset.getValue().filterParams.release = value;
  }
  setFilterCutoff(value: number) {
    this.appService.pickedPreset.getValue().filterParams.cutoff = value;
    this.appService.updateSoundByFilterParam.next(true);
  }
}
