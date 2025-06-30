import { Injectable } from '@angular/core';
import { NotesService } from './notes.service';

@Injectable({
  providedIn: 'root'
})
export class MidiService {

  constructor(private notesService: NotesService) { }

  initializeMidi() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    } else {
      console.log('Web MIDI API is not supported in this browser.');
    }
  }

  private onMIDISuccess(midiAccess: any) {
    const inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.onMIDIMessage.bind(this);
    }
  }

  private onMIDIMessage(event: WebMidi.MIDIMessageEvent) {
    const command = event.data[0];

    // Process Note On (0x90-0x9F) and Note Off (0x80-0x8F) messages
    if ((command & 0xF0) === 0x90 || (command & 0xF0) === 0x80) {
      const note = event.data[1];
      const velocity = event.data[2];
      this.notesService.handleMidiEvent(command, note, velocity);
    }
  }

  private onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
  }
}
