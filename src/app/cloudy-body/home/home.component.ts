import { Component } from '@angular/core';
import { MapComponent } from "./map/map.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { RecommendationCardComponent } from "./recommendation-card/recommendation-card.component";

@Component({
  selector: 'app-home',
  imports: [MapComponent, SearchBarComponent, RecommendationCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
