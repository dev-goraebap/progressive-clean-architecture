import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { AddPostDTO, PostService } from "src/entities";

import { LinkPreviewApi } from "src/shared";

@Component({
    selector: 'add-post-form',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    template: `
    <form [formGroup]="formGroup" (submit)="onSubmit()" class="flex flex-col gap-2">
        <div class="flex gap-2">
            <input placeholder="url을 입력해 주세요." formControlName="url" class="border-2 border-black rounded-md p-2 w-full" />
            <button type="button" class="border-2 border-black rounded-md p-2 bg-red-300 font-bold min-w-[100px]" (click)="onRequestMetaData()">확인</button>
        </div>

        @if(doneMetaData) {
            <label>
                <span class="text-sm">제목</span>
                <input formControlName="title" class="border-2 border-black rounded-md p-2 w-full" readonly />
            </label>
            <label>
                <span class="text-sm">설명</span>
                <input formControlName="description" class="border-2 border-black rounded-md p-2 w-full" readonly />
            </label>
            <div>
                <span class="text-sm">썸네일</span>
                <div class="rounded-xl overflow-hidden">
                    <img [src]="formGroup.value.thumbnail" class="w-full" />
                </div>
            </div>

            <button class="w-full border-2 border-black rounded-xl p-2">등록</button>
        }

    </form>
    `
})
export class AddPostForm {

    doneMetaData = false;

    readonly formGroup = new FormGroup({
        url: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        thumbnail: new FormControl(''),
    });

    constructor(
        private readonly linkPreviewApi: LinkPreviewApi,
        private readonly postService: PostService,
    ) { }

    onRequestMetaData() {
        const { url } = this.formGroup.value;

        if (!url) {
            window.alert('url을 입력해 주세요.');
            return;
        }

        this.linkPreviewApi.getMetaData(url)
            .subscribe({
                next: (data) => {
                    this.formGroup.patchValue({
                        title: data.title,
                        description: data.description,
                        thumbnail: data.image
                    });

                    this.doneMetaData = true;
                },
                error: (error) => {
                    console.log(error);
                    window.alert('사용할 수 없는 url 형식이거나 사이트에서 접근을 제한합니다.');
                }
            });
    }

    async onSubmit() {
        console.log(this.formGroup.value);
        await this.postService.add(this.formGroup.value as AddPostDTO);
    }
}