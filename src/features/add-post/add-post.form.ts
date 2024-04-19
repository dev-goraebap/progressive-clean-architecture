import { Component, effect, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { AddPostDTO, CategoryEntity, CategoryService, PostService } from "src/entities";

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
            <div class="w-[100px]">
                <span class="text-sm">썸네일</span>
                <div class="rounded-xl overflow-hidden">
                    <img [src]="formGroup.value.thumbnail" class="w-full" />
                </div>
            </div>

            <div class="grid grid-cols-3 gap-2" formArrayName="categories">
                @for (category of categories(); track $index;) {
                    <div class="p-2  text-sm border-2 border-black rounded-md flex justify-between items-center" [title]="category.name">
                        <span class="truncate">{{category.name}}</span>
                        <input type="checkbox"
                        (click)="onCheck($index, category.id)"/>
                    </div>
                }
            </div>

            <button class="w-full border-2 border-black rounded-xl p-2">등록</button>
        }
    </form>
    `
})
export class AddPostForm {

    private readonly linkPreviewApi: LinkPreviewApi = inject(LinkPreviewApi);
    public readonly categoryService: CategoryService = inject(CategoryService);
    public readonly postService: PostService = inject(PostService);
    private readonly fb: FormBuilder = inject(FormBuilder);

    doneMetaData = false;

    categories = signal<CategoryEntity[]>([]);

    readonly formGroup = new FormGroup({
        url: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        thumbnail: new FormControl(''),
        categories: new FormArray([])
    });

    constructor() { 
        effect(() => {
            console.log(this.categoryService.state$());
        });
    }

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

    onCheck(index: number, categoryId: string) {
        const categories = this.formGroup.get('categories') as FormArray;
        const control = categories.at(index);
        control.setValue(!control.value ? categoryId : '');
    }

    async onSubmit() {
        console.log(this.formGroup.value);
        const { categories, ...dto } = this.formGroup.value;

        const categoryIds = categories?.filter(categoryId =>!!categoryId);
        console.log(categoryIds);

        const result = {
            ...dto,
            categoryIds
        };

        await this.postService.add(result as AddPostDTO);
    }
}