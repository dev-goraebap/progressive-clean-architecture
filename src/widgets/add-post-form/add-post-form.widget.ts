import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { tap } from "rxjs";

import { CategoryService } from "src/entities";
import { CategoryCheckbox, RequestUrlMetadataButton } from "src/features";
import { LinkPreviewMetaData } from "src/shared";

@Component({
    selector: 'add-post-form-widget',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RequestUrlMetadataButton,
        CategoryCheckbox
    ],
    template: `
    <form [formGroup]="formGroup" (submit)="onSubmit()" class="flex flex-col gap-2">
        <div class="flex gap-2">
            <input placeholder="url을 입력해 주세요." formControlName="url" class="border-2 border-black rounded-md p-2 w-full" />
            <request-url-metadata-button 
                [url]="formGroup.get('url')?.value"
                (resultEvent)="onLoadMetaData($event)"
            />
        </div>
        @if(loadMetaData) {
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

            <div class="grid grid-cols-2 gap-2" formArrayName="categories" formArrayName="categories">
                @for (control of categories.controls; track $index;) {
                    <category-checkbox [label]="control.value.name" [formControlName]="$index+'checked'"/>
                }
            </div>

            <br/>
            <button class="w-full border-2 border-black rounded-xl p-2">등록</button>
        }
    </form>
    `
})
export class AddPostFormWidget {

    loadMetaData = false;

    readonly formGroup!: FormGroup;

    private readonly formBuilder = inject(FormBuilder);

    private readonly categoryService = inject(CategoryService);

    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.formGroup = this.formBuilder.group({
            url: new FormControl(''),
            title: new FormControl(''),
            description: new FormControl(''),
            thumbnail: new FormControl(''),
            categories: new FormArray([])
        });

        this.categoryService.getCategories().pipe(
            tap(result => {
                console.log(result);
                const formArray = this.formGroup.get('categories') as FormArray;

                result.items.forEach(category => {
                    formArray.push(
                        new FormGroup({
                            checked: new FormControl(false),
                            name: new FormControl(category.name),
                            id: new FormControl(category.id)
                        })
                    );
                });

                console.log(this.formGroup);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    get categories(): FormArray {
        return this.formGroup.get('categories') as FormArray;
    }

    onCheck(index: number, categoryId: string) {
        const categories = this.formGroup.get('categories') as FormArray;
        const control = categories.at(index);
        control.setValue(!control.value ? categoryId : '');
    }

    onLoadMetaData(metadata: LinkPreviewMetaData) {
        this.loadMetaData = true;

        this.formGroup.patchValue({
            title: metadata.title,
            description: metadata.description,
            thumbnail: metadata.image
        });
    }

    onSubmit() {
        console.log(this.categories);
        // console.log(this.formGroup.value);
        // const { categories, ...dto } = this.formGroup.value;

        // const categoryIds = categories?.filter(categoryId =>!!categoryId);
        // console.log(categoryIds);

        // const result = {
        //     ...dto,
        //     categoryIds
        // };

        // await this.postService.add(result as AddPostDTO);
    }
}