import { Component, inject } from "@angular/core";
import { ModalController } from "src/shared";

import { AddPostFormWidget } from "src/widgets";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        AddPostFormWidget
    ],
    template: `
    <div class="p-4">
        <h2>피드 페이지</h2>
        <br/>
        <button (click)="onOpenModal()">게시물 생성</button>
    </div>
    `
})
export class FeedPage { 

    private readonly modalCtrl = inject(ModalController);

    onOpenModal() {
        this.modalCtrl.open(AddPostFormWidget, {
            title: '게시물 생성',
            description: '게시물을 생성합니다.'
        });
    }
}