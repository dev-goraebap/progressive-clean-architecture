import { Component, EventEmitter, Input, Output, inject } from "@angular/core";

import { LinkPreviewApi, LinkPreviewMetaData } from "src/shared";

@Component({
    selector: 'request-url-metadata-button',
    standalone: true,
    template: `
    <button 
        type="button" 
        class="border-2 border-black rounded-md p-2 bg-red-300 font-bold min-w-[100px]" 
        (click)="onRequestMetaData()">
        확인
    </button>
    `
})
export class RequestUrlMetadataButton {

    @Input() 
    url?: string;

    @Output()
    readonly resultEvent = new EventEmitter<LinkPreviewMetaData>();

    private readonly linkPreviewApi = inject(LinkPreviewApi);

    onRequestMetaData() {
        if (!this.url) {
            window.alert('url을 입력해 주세요.');
            return;
        }

        this.linkPreviewApi.getMetaData(this.url)
            .subscribe({
                next: (data) => {
                    this.resultEvent.emit(data);
                },
                error: (error) => {
                    console.log(error);
                    window.alert('사용할 수 없는 url 형식이거나 사이트에서 접근을 제한합니다.');
                }
            });
    }
}