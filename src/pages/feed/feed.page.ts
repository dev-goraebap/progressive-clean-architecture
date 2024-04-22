import { Component, inject } from "@angular/core";

import { ModalController } from "src/shared";
import { AddPostFormWidget, PostListWidget } from "src/widgets";

@Component({
    selector: 'feed-page',
    standalone: true,
    imports: [
        PostListWidget
    ],
    template: `
    <div class="p-4 border flex flex-col items-center">
        <h2>피드 페이지</h2>
        <br/>
        <button (click)="onOpenModal()">게시물 생성</button>
        <post-list-widget />
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