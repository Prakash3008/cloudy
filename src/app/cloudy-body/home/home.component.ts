import { Component } from '@angular/core';
import { MapComponent } from "./map/map.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";

@Component({
  selector: 'app-home',
  imports: [MapComponent, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
