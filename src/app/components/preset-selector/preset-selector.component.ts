import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Preset } from '../../app-types';

@Component({
  selector: 'app-preset-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preset-selector.component.html',
  styleUrl: './preset-selector.component.scss'
})
export class PresetSelectorComponent {
  options: Preset[] = this.appService.presets;
  $pickedOption = this.appService.pickedPreset.pipe();

  constructor(private appService: AppService) { }

  pickPreset(preset: Preset) {
    console.log(JSON.stringify(preset))
    this.appService.pickPreset(preset);
  }
}
