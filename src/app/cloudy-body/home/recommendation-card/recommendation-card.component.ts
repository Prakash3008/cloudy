import { Component, OnInit } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendation-card',
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, CommonModule],
  templateUrl: './recommendation-card.component.html',
  styleUrl: './recommendation-card.component.scss'
})
export class RecommendationCardComponent implements OnInit {
  recommendations: { [key: string]: any[] } = {};

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.recommendations$.subscribe((status: any) => {
      this.recommendations = status;
    });
  }
}
