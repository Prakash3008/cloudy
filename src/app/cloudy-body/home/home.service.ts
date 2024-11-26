import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private stopSelection = new BehaviorSubject<any>('');  

  stopSelection$ = this.stopSelection.asObservable();

  updateStopSelection(newState: any): void {
    this.stopSelection.next(newState);
  }

  constructor() { }
}
