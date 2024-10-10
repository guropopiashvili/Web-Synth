import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { KnobType } from '../../app-enums';

@Component({
  selector: 'app-knob',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knob.component.html',
  styleUrl: './knob.component.scss'
})
export class KnobComponent implements AfterViewInit {
  @Input() type: KnobType = KnobType.OneDirectional;

  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() label: string = 'Control';
  @Input() set value(value: number) {
    this._value = value;
    if (this.canvasEl) {
      this.draw();
    }
  }
  _value!: number;

  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();


  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;

  canvas!: HTMLCanvasElement
  ctx!: CanvasRenderingContext2D;

  controlIsActive: boolean = false;
  pointerY: number = 0;

  constructor() { }

  ngAfterViewInit(): void {
    this.setUpCanvas();
    this.draw();
  }

  setUpCanvas() {
    this.canvas = this.canvasEl.nativeElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    let pixelRatio, sizeOnScreen;

    pixelRatio = window.devicePixelRatio;
    sizeOnScreen = this.canvas.getBoundingClientRect();
    this.canvas.width = sizeOnScreen.width * pixelRatio;
    this.canvas.height = sizeOnScreen.height * pixelRatio;
    this.canvas.style.width = this.canvas.width / pixelRatio + "px";
    this.canvas.style.height = this.canvas.height / pixelRatio + "px";

    this.ctx.fillStyle = "#8f2b2b";
    this.ctx.strokeStyle = "#fff";
  }

  draw() {
    // clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.type === KnobType.OneDirectional || this.type === KnobType.BiDirectional) {
      // draw start and end indicators
      this.ctx.beginPath();
      this.ctx.lineWidth = 4;
      this.ctx.moveTo(this.canvas.width / 7, this.canvas.height - this.canvas.height / 7);
      this.ctx.lineTo(this.canvas.width / 4.5, this.canvas.height - this.canvas.height / 4.5);
      this.ctx.moveTo(this.canvas.width - this.canvas.width / 7, this.canvas.height - this.canvas.height / 7);
      this.ctx.lineTo(this.canvas.width - this.canvas.width / 4.4, this.canvas.height - this.canvas.height / 4.4);
      this.ctx.stroke();
      // draw indicators around
      this.ctx.beginPath();
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = "#ffdbdb";
      this.ctx.setLineDash([2, 12]);
      this.ctx.moveTo(this.canvas.width / 5, this.canvas.height - this.canvas.height / 5);
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 47, -Math.PI * 1.25, Math.PI * 0.25);
      this.ctx.stroke();
      // draw current value indicator
      const startAngle: number = this.type === KnobType.OneDirectional ? -Math.PI * 1.25 : Math.PI * 1.5;
      const endAngle: number = this.type === KnobType.OneDirectional ? -Math.PI * 1.25 + (Math.PI * 1.5 * this._value / 100) : Math.PI * 1.5 + (Math.PI * 1.5 * (this._value - 50) / 100);
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = 4;
      this.ctx.setLineDash([0]);
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 40, startAngle, endAngle, this.type === KnobType.BiDirectional && this._value < 50);
      this.ctx.stroke();
    }

    if (this.type === KnobType.Oscillator) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      // draw sine wave
      this.ctx.moveTo(0, this.canvas.height - 10);
      this.ctx.bezierCurveTo(8, this.canvas.height - 30, 8, this.canvas.height + 10, 16, this.canvas.height - 10);
      // draw triangle wave
      this.ctx.moveTo(0, 12);
      this.ctx.lineTo(6, 1);
      this.ctx.lineTo(12, 12);
      // draw triangle wave
      this.ctx.moveTo(this.canvas.width - 12, 12);
      this.ctx.lineTo(this.canvas.width - 12, 1);
      this.ctx.lineTo(this.canvas.width, 12);
      // draw triangle wave
      this.ctx.moveTo(this.canvas.width - 12, this.canvas.height);
      this.ctx.lineTo(this.canvas.width - 12, this.canvas.height - 12);
      this.ctx.lineTo(this.canvas.width - 2, this.canvas.height - 12);
      this.ctx.lineTo(this.canvas.width - 2, this.canvas.height);


      this.ctx.stroke();
    }
  }

  onMouseDown(event: MouseEvent) {
    this.controlIsActive = true;
    this.pointerY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.controlIsActive) {
      let changeInValue = this.pointerY - event.clientY;
      this.pointerY = event.clientY;

      this._value += changeInValue;

      if (this._value > 100) {
        this._value = 100;
      }
      if (this._value < this.min) {
        this._value = this.min;
      }

      this.valueChange.emit(this._value);
      this.draw();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onmouseUp(event: MouseEvent) {
    this.controlIsActive = false;
  }

  knobRotation(): number {
    let rotation = this._value * 2.7 - 135;
    if (this.type === KnobType.Oscillator) {
      const v = Math.round(this._value / 30);
      if (v === 0) {
        return - 135;
      }
      if (v === 1) {
        return -45;
      }
      if (v === 2) {
        return 45;
      }
      if (v === 3) {
        return 135;
      }
    }
    return rotation;
  }
}
