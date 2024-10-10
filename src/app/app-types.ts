import { LfoModeEnum, NotesEnum } from "./app-enums"

export type Sound = {
    note: NotesEnum | null,
    o: OscillatorNode,
    g: GainNode,
    v: GainNode,
    f: BiquadFilterNode,
    oscId: number,
    // lfoO: OscillatorNode,
    // lfoG: GainNode,
    // volumeNode: GainNode,
    // oscIndex: number,
}


export type OscillatorParams = {
    id: number,
    oscillatorType: number,
    volume: number,
    attack: number,
    decay: number,
    sustain: number,
    release: number,
    coarse: number,
    lfoAmplitude: number,
    isActive: boolean,
}

export type LfoParams = {
    oscillatorType: number,
    mode: number,
    rate: number,
    amplitude: number,
}

export type FilterParams = {
    attack: number,
    decay: number,
    sustain: number,
    release: number,
    cutoff: number,
}

export type MasterParams = {
    chorus: number,
    masterVolume: number,
    pan: number,
}

export type Preset = {
    name: string,
    startingOctave: number,
    masterParams: MasterParams,
    lfoParams: LfoParams,
    filterParams: FilterParams,
    oscParams: [OscillatorParams, OscillatorParams, OscillatorParams],
}