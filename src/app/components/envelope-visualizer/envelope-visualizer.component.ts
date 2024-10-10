import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-envelope-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './envelope-visualizer.component.html',
  styleUrl: './envelope-visualizer.component.scss'
})
export class EnvelopeVisualizerComponent implements AfterViewInit {
  _volume: number = 0;
  _attack: number = 0;
  _decay: number = 0;
  _sustain: number = 0;
  _release: number = 0;

  @Input() set volume(volume: number) {
    this._volume = volume;
    this.draw();
  }
  @Input() set attack(attack: number) {
    this._attack = attack;
    this.draw();
  }
  @Input() set decay(decay: number) {
    this._decay = decay;
    this.draw();
  }
  @Input() set sustain(sustain: number) {
    this._sustain = sustain;
    this.draw();
  }
  @Input() set release(release: number) {
    this._release = release;
    this.draw();
  }

  

  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.setInitialCanvasParameters();
  }

  setInitialCanvasParameters() {
    this.canvas = this.canvasEl.nativeElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    let pixelRatio, sizeOnScreen;

    pixelRatio = window.devicePixelRatio;
    sizeOnScreen = this.canvas.getBoundingClientRect();
    this.canvas.width = sizeOnScreen.width * pixelRatio;
    this.canvas.height = sizeOnScreen.height * pixelRatio;
    this.canvas.style.width = this.canvas.width / pixelRatio + "px";
    this.canvas.style.height = this.canvas.height / pixelRatio + "px";

    this.draw();
  }

  draw() {
    if (!this.canvas) {
      return
    }

    const margin: number = 10;
    const circleRadius: number = 5;
    const point1 = {
      x: margin,
      y: this.canvas.height - margin
    }

    const point2 = {
      x: (this.canvas.width - 2 * margin) / 3 * this._attack / 100 + margin,
      y: (this.canvas.height - 2 * margin) - (this.canvas.height - 2 * margin) * this._volume / 100 + margin
    }

    const point3 = {
      x: point2.x + ((this.canvas.width - 2 * margin) / 3 * this._decay + margin) / 100,
      y: this.canvas.height - margin - (this.canvas.height - margin - point2.y) * this._sustain / 100
    }

    const point4 = {
      x: point3.x + ((this.canvas.width - 2 * margin) / 3 * this._release + margin) / 100,
      y: this.canvas.height - margin
    }

    // clear context
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // set background
    this.ctx.fillStyle = "#8f2b2b";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();

    // circle 1
    this.ctx.fillStyle = "#fdb4b4";
    this.ctx.strokeStyle = "#fdb4b4";
    this.ctx.lineWidth = 3;
    this.ctx.arc(point1.x, point1.y, circleRadius, 0, 360);
    // line 1
    this.ctx.moveTo(margin, this.canvas.height - margin);
    this.ctx.lineTo(point2.x, point2.y);
    // circle 2
    this.ctx.moveTo(point2.x, point2.y);
    this.ctx.arc(point2.x, point2.y, circleRadius, 0, 360);
    // line 2
    this.ctx.moveTo(point2.x, point2.y);
    this.ctx.lineTo(point3.x, point3.y);
    // circle 3
    this.ctx.moveTo(point3.x, point3.y);
    this.ctx.arc(point3.x, point3.y, circleRadius, 0, 360);
    // line 3
    this.ctx.moveTo(point3.x, point3.y);
    this.ctx.lineTo(point4.x, point4.y);
    // circle 4
    this.ctx.moveTo(point4.x, point4.y);
    this.ctx.arc(point4.x, point4.y, circleRadius, 0, 360);

    this.ctx.fill();
    this.ctx.stroke();
  }
}
