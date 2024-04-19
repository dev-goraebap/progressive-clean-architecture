import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PocketBaseClient } from 'src/shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private readonly pocketBaseClient: PocketBaseClient = inject(PocketBaseClient);
  
  constructor() {
    this.pocketBaseClient.initialize();
  }
}
