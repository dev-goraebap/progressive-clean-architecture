import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LinkPreviewApi } from "src/shared";

@Component({
    selector: 'add-post-form',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    template: `
    <form [formGroup]="formGroup" (submit)="onSubmit()">
        <input placeholder="url을 입력해 주세요." formControlName="url"/>
        <button type="button" class="" (click)="onRequestMetaData()">확인</button>
    </form>
    `
})
export class AddPostForm {

    readonly formGroup = new FormGroup({
        url: new FormControl('')
    });

    constructor(
        private readonly linkPreviewApi: LinkPreviewApi
    ) {}

    onRequestMetaData() {
        console.log('click');
        const { url } = this.formGroup.value;
        if (!url) {
            window.alert('url을 입력해 주세요.');
            return;
        }
        this.linkPreviewApi.getMetaData(url)
            .subscribe({
                next: (data) => console.log(data),
                error: (error) => console.error(error)
            });
    }

    onSubmit() {

    }
}