import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dino } from '../model/dinoInterface';
import { WikipediaResponse } from '../model/dinoDetailsInterface';

@Injectable({
  providedIn: 'root'
})
export class DinoServ {
  dino:Dino[]= [];
  
  constructor(private oHttp: HttpClient) { }
  
  getAllDinos():Observable<Dino[]>{
    return this.oHttp.get<Dino[]>('https://dinosaur-facts-api.shultzlab.com/dinosaurs');
  }
  
  getDinoDescription(name: string): Observable<WikipediaResponse> {
    return this.oHttp.get<WikipediaResponse>('https://en.wikipedia.org/api/rest_v1/page/summary/' + name);
  }
}
