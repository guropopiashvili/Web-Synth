import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-oscillator-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './oscillator-visualizer.component.html',
  styleUrl: './oscillator-visualizer.component.scss'
})
export class OscillatorVisualizerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  analyser!: AnalyserNode;
  dataArray!: Uint8Array;
  subscription!: Subscription;
  private drawingStarted = false;

  constructor(private audioService: AudioService) {}

  draw = () => {
    if (!this.analyser) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.analyser.getByteTimeDomainData(this.dataArray);
    let segmentWidth = this.canvas.width / this.analyser.frequencyBinCount;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.moveTo(-100, this.canvas.height / 2);
    for (let i = 1; i < this.analyser.frequencyBinCount; i += 1) {
      let x = i * segmentWidth;
      let v = this.dataArray[i] / 128.0;
      let y = (v * this.canvas.height) / 2;
      this.ctx.lineTo(x, y);
    }
    this.ctx.lineTo(this.canvas.width + 100, this.canvas.height / 2);
    this.ctx.stroke();
    requestAnimationFrame(this.draw);
  }

  ngAfterViewInit(): void {
    this.setInitialCanvasParameters();
    this.subscription = this.audioService.analyser$.subscribe(analyser => {
      if (analyser && !this.drawingStarted) {
        this.analyser = analyser;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.drawingStarted = true;
        this.draw();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setInitialCanvasParameters() {
    this.canvas = this.canvasEl.nativeElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    let pixelRatio, sizeOnScreen;

    pixelRatio = window.devicePixelRatio;
    sizeOnScreen = this.canvas.getBoundingClientRect();
    this.canvas.width = (sizeOnScreen.width - 100) * pixelRatio;
    this.canvas.height = (sizeOnScreen.height - 50) * pixelRatio;
    this.canvas.style.width = this.canvas.width / pixelRatio + "px";
    this.canvas.style.height = this.canvas.height / pixelRatio + "px";

    this.ctx.fillStyle = "#ffffff00";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();
  }
}
