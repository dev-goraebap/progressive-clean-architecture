import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ModalComponent, ModalController } from 'src/shared';
import { AddPostFormWidget } from 'src/widgets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  private readonly modalCtrl = inject(ModalController);

  constructor() {}

  onOpenModal() {
    this.modalCtrl.open(AddPostFormWidget);
  }
}
