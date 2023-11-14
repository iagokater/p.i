import { Component, OnInit, OnDestroy } from '@angular/core';
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

  volumes: IData[] = [];
  alturaAgua: number = 0;
  mediaVolumes: number = 0;
  maiorVolume: number = 0;
  menorVolume: number = 0;
  temperatura: IData[] = [];
  alturaTemperatura: number = 0;
  mediaTemperatura: number = 0;
  maiorTemperatura: number = 0;
  menorTemperatura: number = 0;
  DataHora: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Componente inicializado');

    this.subscription = interval(2000)
      .pipe(switchMap(() => this.getDataAPI()))
      .subscribe(
        (response) => {
          console.log('Resposta da API:', response);
          this.volumes = response;
          this.alturaAgua = this.volumes[0].volume;
          this.calcularEstatisticas();
          this.alturaTemperatura = this.volumes[0].temperatura;
          this.DataHora = new Date(this.volumes[0].DataHora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        },
        (error) => console.error('Erro: ', error)
      );
  }

  ngOnDestroy() {
    console.log('Componente destruído');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getDataAPI(): Observable<IData[]> {
    return this.http.get<IData[]>('http://192.168.86.200:3000/volume');
  }

  calcularEstatisticas() {
    this.mediaVolumes = Math.floor(
      this.volumes.reduce((acc, volume) => acc + volume.volume, 0) / this.volumes.length
    );

    this.maiorVolume = Math.floor(Math.max(...this.volumes.map((volume) => volume.volume)));

    this.menorVolume = Math.floor(Math.min(...this.volumes.map((volume) => volume.volume)));

    this.mediaTemperatura = Math.floor(
      this.volumes.reduce((acc, volume) => acc + volume.temperatura, 0) / this.volumes.length
    );

    this.maiorTemperatura = Math.floor(Math.max(...this.volumes.map((volume) => volume.temperatura)));

    this.menorTemperatura = Math.floor(Math.min(...this.volumes.map((volume) => volume.temperatura)));
    
  }
}
