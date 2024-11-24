import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CloudyBodyComponent } from "./cloudy-body/cloudy-body.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, SidebarComponent, CloudyBodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cloudy';
}
