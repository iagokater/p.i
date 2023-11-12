import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface IData {
  id: number;
  volume: number;
  DataHora: string;
  temperatura: number;
  Data: string;
  Hora: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  baseUrl: string = 'http:/0.0.0.0:23130'; // Endereço padrão (com IP e porta)
  volumes: IData[] = [];
  alturaAgua: number = 0;
  mediaVolumes: number = 0;
  maiorVolume: number = 0;
  menorVolume: number = 0;

  constructor(private http: HttpClient, private appRef: ApplicationRef) {}

  ngOnInit() {
    this.restartSubscription();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getDataAPI(): Observable<IData[]> {
    return this.http.get<IData[]>(`${this.baseUrl}/volume`);
  }

  calcularEstatisticas() {
    this.mediaVolumes = Math.floor(
      this.volumes.reduce((acc, volume) => acc + volume.volume, 0) / this.volumes.length
    );
    this.maiorVolume = Math.floor(Math.max(...this.volumes.map((volume) => volume.volume)));
    this.menorVolume = Math.floor(Math.min(...this.volumes.map((volume) => volume.volume)));
  }

  onConfigSave() {
    this.setBaseUrl(this.baseUrl);
  }

  setBaseUrl(newUrl: string) {
    this.baseUrl = newUrl;
    this.restartSubscription();
  }

  restartSubscription() {
    this.subscription.unsubscribe();
    this.subscription = interval(1000)
      .pipe(switchMap(() => this.getDataAPI()))
      .subscribe(
        (response) => {
          this.volumes = response;
          this.alturaAgua = this.volumes[0].volume;
          this.calcularEstatisticas();
        },
        (error) => console.error('Erro: ', error)
      );
  }
}