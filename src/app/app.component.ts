import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CloudyBodyComponent } from "./cloudy-body/cloudy-body.component";
import { FirebaseServiceService } from './firebase-service.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, SidebarComponent, CloudyBodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'cloudy';

  constructor(private firebaseService: FirebaseServiceService) {}

  ngOnInit(): void {
  }
}
