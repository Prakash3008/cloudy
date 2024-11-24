import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import {MatToolbarModule, } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  
}
