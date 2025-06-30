import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PresetSelectorComponent } from "./components/preset-selector/preset-selector.component";
import { KeyboardComponent } from './keyboard/keyboard.component';
import { OscillatorComponent } from './oscillator/oscillator.component';
import { LfoComponent } from './lfo/lfo.component';
import { FilterComponent } from './filter/filter.component';
import { MasterControlsComponent } from './master-controls/master-controls.component';
import { OscillatorVisualizerComponent } from './oscillator-visualizer/oscillator-visualizer.component';
import { SettingsComponent } from './settings/settings.component';
import { AudioService } from './services/audio.service';
import { Preset } from './app-types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, PresetSelectorComponent, KeyboardComponent, OscillatorComponent, LfoComponent, FilterComponent, MasterControlsComponent, OscillatorVisualizerComponent, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  pickedPreset!: Preset;

  constructor(private audioService: AudioService) {
    this.audioService.appService.pickedPreset.subscribe((preset) => this.pickedPreset = preset);
  }
}