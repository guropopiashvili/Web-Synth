import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HelperService } from './helper.service';
import { NotesService } from './notes.service';
import { SettingsService } from './settings.service';
import { Preset, Sound } from '../app-types';
import { NotesEnum } from '../app-enums';
import { OscillatorParams } from '../app-types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioContext!: AudioContext;
  compressorNode!: DynamicsCompressorNode;
  mainGainNode!: GainNode;
  lfoNode!: OscillatorNode;
  lfoGainNode!: GainNode;
  filterNode!: BiquadFilterNode;
  analyser!: AnalyserNode; //visualizer
  stereoPanner!: StereoPannerNode;
  delayNode!: DelayNode;
  delayTime: number = 0.035;
  delayGain!: GainNode; // chorus

  sounds: Sound[] = [];
  pickedPreset!: Preset;

  analyser$ = new BehaviorSubject<AnalyserNode | null>(null);

  constructor(
    public appService: AppService,
    private helperService: HelperService,
    private notesService: NotesService,
    private settingsService: SettingsService
  ) {
    this.subscribeToCurrentPreset();
    this.subscribeToNoteEvents();
    this.subscribeToParamUpdates();
  }

  subscribeToCurrentPreset() {
    this.appService.pickedPreset.subscribe((preset) => this.pickedPreset = preset);
  }

  subscribeToNoteEvents() {
    this.notesService.keyAdded.subscribe((note: NotesEnum) => {
      this.setupAudioContext();

      for (const oscParam of this.pickedPreset.oscParams) {
        if (!oscParam.isActive) { // skip disabled oscillators
          continue
        }

        const sound: Sound = {
          note,
          o: this.audioContext.createOscillator(),
          g: this.audioContext.createGain(),
          v: this.audioContext.createGain(),
          f: this.audioContext.createBiquadFilter(),
          oscId: oscParam.id,
        }

        this.lfoNode.type = this.helperService.knobValueToOscType(this.pickedPreset.lfoParams.oscillatorType);
        this.lfoNode.frequency.value = this.helperService.knobValueToLfoRate(this.pickedPreset.lfoParams.rate);
        this.lfoGainNode.gain.value = this.helperService.knobValueToLfoAmplitude(this.pickedPreset.lfoParams.amplitude, this.pickedPreset.lfoParams.mode, this.helperService.knobValueToVolume(oscParam.volume));

        sound.o.type = this.helperService.knobValueToOscType(oscParam.oscillatorType);
        sound.o.frequency.value = this.helperService.findFrequencyValue(note, this.helperService.knobValueToCoarse(oscParam.coarse));
        sound.g.gain.value = 0;
        sound.v.gain.value = this.helperService.knobValueToVolume(oscParam.volume);
        sound.f.type = "lowpass";
        sound.f.frequency.value = 0;

        this.lfoNode.connect(this.lfoGainNode);
        if (this.pickedPreset.lfoParams.mode === 0) {
          this.lfoGainNode.connect(sound.v.gain);
        } else if (this.pickedPreset.lfoParams.mode === 1) {
          this.lfoGainNode.connect(sound.o.frequency);
        }
        sound.o.connect(sound.g);
        sound.g.connect(sound.v);
        sound.v.connect(sound.f);
        sound.f.connect(this.compressorNode);

        sound.o.start();

        sound.g.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + this.helperService.knobValueToAttack(oscParam.attack));
        sound.g.gain.setTargetAtTime(this.helperService.knobValueToSustain(oscParam.sustain), this.audioContext.currentTime + this.helperService.knobValueToAttack(oscParam.attack), this.helperService.knobValueToDecay(oscParam.decay));

        sound.f.frequency.linearRampToValueAtTime(this.helperService.knobValueToFilterCutoff(this.pickedPreset.filterParams.cutoff), this.audioContext.currentTime + this.helperService.knobValueToFilterAttack(this.pickedPreset.filterParams.attack));
        sound.f.frequency.setTargetAtTime(this.helperService.knobValueToFilterSustain(this.pickedPreset.filterParams.sustain, this.helperService.knobValueToFilterCutoff(this.pickedPreset.filterParams.cutoff)), this.audioContext.currentTime + this.helperService.knobValueToFilterAttack(this.pickedPreset.filterParams.attack), this.helperService.knobValueToFilterDecay(this.pickedPreset.filterParams.decay));

        this.sounds.push(sound);
      }
    });

    this.notesService.keyRemoved.subscribe((note: NotesEnum) => {
      const sounds = this.sounds.filter((sound) => sound?.note === note);

      for (const sound of sounds) {
        const oscParams = this.pickedPreset.oscParams.find((param) => param.id === sound.oscId) as OscillatorParams;

        sound.note = null;
        sound.g.gain.cancelScheduledValues(0);
        sound.g.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + this.helperService.knobValueToRelease(oscParams.release));
        if (this.pickedPreset.filterParams.release > 0) {
          sound.f.frequency.linearRampToValueAtTime(0, this.audioContext.currentTime + this.helperService.knobValueToFilterRelease(this.pickedPreset.filterParams.release));
        }
        sound.o.stop(this.audioContext.currentTime + this.helperService.knobValueToRelease(oscParams.release));
        sound.o.addEventListener('ended', () => {
          this.sounds.splice(this.sounds.indexOf(sound), 1);
        });
      }
    });
  }

  subscribeToParamUpdates() {
    this.appService.updateSoundByOscParam.subscribe(() => {
      this.updateOscParamValuesRealTime();
    });

    this.appService.updateSoundByLfoParam.subscribe(() => {
      this.updateLfoParamValuesRealTime();
    });

    this.appService.updateSoundByFilterParam.subscribe(() => {
      this.updateFilterParamValuesRealTime();
    });

    this.appService.updateSoundByMasterParam.subscribe(() => {
      this.updateMasterParamValuesRealTime();
    });
  }

  setupAudioContext() {
    if (this.audioContext) {
      return
    }

    this.audioContext = new AudioContext({
      latencyHint: 'interactive',
      sampleRate: 48000,
    });
    this.mainGainNode = new GainNode(this.audioContext, { gain: this.helperService.knobValueToVolume(this.pickedPreset.masterParams.masterVolume) });
    this.analyser = new AnalyserNode(this.audioContext, {
      smoothingTimeConstant: 1,
      fftSize: 2048
    });
    this.analyser$.next(this.analyser);
    this.stereoPanner = new StereoPannerNode(this.audioContext, { pan: this.helperService.knobValueToPan(this.pickedPreset.masterParams.pan) });
    this.compressorNode = this.audioContext.createDynamicsCompressor();
    this.lfoGainNode = this.audioContext.createGain();
    this.lfoNode = this.audioContext.createOscillator();
    this.lfoNode.start();

    // 

    // Splits the stereo channel into two mono channels.
    let splitter = new ChannelSplitterNode(this.audioContext, { numberOfOutputs: 2 });

    // Merges two mono channels into a single stereo channel.
    let merger = new ChannelMergerNode(this.audioContext, { numberOfInputs: 2 });

    // Delays input
    this.delayNode = new DelayNode(this.audioContext, { delayTime: this.pickedPreset.masterParams.chorus ? this.delayTime : 0 });
    let delayO = new OscillatorNode(this.audioContext, { type: "sine", frequency: 0.5 });
    this.delayGain = new GainNode(this.audioContext, { gain: this.helperService.knobValueToChorus(this.pickedPreset.masterParams.chorus) });
    delayO.start();
    delayO.connect(this.delayGain);
    this.delayGain.connect(this.delayNode.delayTime);


    // Split the stereo source into 2 separate mono channels.
    this.mainGainNode.connect(splitter);

    // Connect first channel of source directly to the merger
    splitter.connect(merger, 0, 0);

    // Delay the second channel by 20 ms
    splitter.connect(this.delayNode, 1, 0).connect(merger, 0, 1);
    // Connect the output of the merger to the downstream graph
    merger.connect(this.analyser);
    this.analyser.connect(this.stereoPanner);
    this.stereoPanner.connect(this.audioContext.destination);

    this.compressorNode.connect(this.mainGainNode);
    // 
  }

  updateOscParamValuesRealTime() {
    for (const sound of this.sounds) {
      // oscillator type
      sound.o.type = this.helperService.knobValueToOscType(this.pickedPreset.oscParams[sound.oscId].oscillatorType);
      // volume value
      sound.v.gain.value = this.helperService.knobValueToVolume(this.pickedPreset.oscParams[sound.oscId].volume);
      // coarse value
      if (sound.note) {
        sound.o.frequency.value = this.helperService.findFrequencyValue(sound.note as NotesEnum, this.helperService.knobValueToCoarse(this.pickedPreset.oscParams[sound.oscId].coarse));
      }
    }
  }

  updateLfoParamValuesRealTime() {
    // LFO Osc type
    this.lfoNode.type = this.helperService.knobValueToOscType(this.pickedPreset.lfoParams.oscillatorType);
    // LFO rate
    this.lfoNode.frequency.value = this.helperService.knobValueToLfoRate(this.pickedPreset.lfoParams.rate);
    // LFO amplitude
    for (const oscParam of this.pickedPreset.oscParams) {
      this.lfoGainNode.gain.value = this.helperService.knobValueToLfoAmplitude(this.pickedPreset.lfoParams.amplitude, this.pickedPreset.lfoParams.mode, this.helperService.knobValueToVolume(oscParam.volume));
    }
  }

  updateFilterParamValuesRealTime() {
    // cuttoff
    for (const sound of this.sounds) {
      sound.f.frequency.value = this.helperService.knobValueToFilterCutoff(this.pickedPreset.filterParams.cutoff);
    }
  }

  updateMasterParamValuesRealTime() {
    if (!this.mainGainNode) {
      return;
    }
    // master volume
    this.mainGainNode.gain.value = this.helperService.knobValueToVolume(this.pickedPreset.masterParams.masterVolume);
    // Chorus
    if (this.delayGain) {
      this.delayGain.gain.value = this.helperService.knobValueToChorus(this.pickedPreset.masterParams.chorus);
      this.delayNode.delayTime.value = this.pickedPreset.masterParams.chorus ? this.delayTime : 0;
    }
    // pan
    this.stereoPanner.pan.setTargetAtTime(this.helperService.knobValueToPan(this.pickedPreset.masterParams.pan), this.audioContext.currentTime, 0);
  }
}

