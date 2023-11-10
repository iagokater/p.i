import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom, interval } from 'rxjs';
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
export class AppComponent implements OnInit {
  volumes: IData[] = [];
  alturaAgua: number = 0;
  mediaVolumes: number = 0;
  maiorVolume: number = 0;
  menorVolume: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    interval(5000)
      .pipe(switchMap(() => this.getDataAPI()))
      .subscribe(
        (response) => {
          this.volumes = response;
          this.alturaAgua = this.volumes[500].volume;
          this.calcularEstatisticas();
        },
        (error) => console.error('Erro: ', error)
      );
  }

  getDataAPI(): Observable<IData[]> {
    return this.http.get<IData[]>('http://localhost:3000/volume');
  }

  calcularEstatisticas() {

    this.mediaVolumes = Math.floor(this.volumes.reduce((acc, volume) => acc + volume.volume, 0) / this.volumes.length);

    // Encontrar o maior volume e arredondar para baixo
    this.maiorVolume = Math.floor(Math.max(...this.volumes.map(volume => volume.volume)));

    // Encontrar o menor volume e arredondar para baixo
    this.menorVolume = Math.floor(Math.min(...this.volumes.map(volume => volume.volume)));
  }
}