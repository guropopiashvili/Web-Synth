import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PresetSelectorComponent } from '../components/preset-selector/preset-selector.component';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PresetSelectorComponent, ClickOutsideDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  menuIsOpen = false;
  presetSelectorIsOpen = false;

  onMenuMouseLeave() {
    if (!this.presetSelectorIsOpen) {
      this.menuIsOpen = false;
    }
  }

  closeEverything() {
    this.menuIsOpen = false;
    this.presetSelectorIsOpen = false;
  }
}
