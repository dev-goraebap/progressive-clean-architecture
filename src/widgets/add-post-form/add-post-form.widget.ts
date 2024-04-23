import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { tap } from "rxjs";

import { CategoryModel, CategoryService, PostService } from "src/entities";
import { CategoryCheckbox, RequestUrlMetadataInput } from "src/features";
import { BaseInput, LinkPreviewMetaData, fadeInOut } from "src/shared";

@Component({
    selector: 'add-post-form-widget',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RequestUrlMetadataInput,
        CategoryCheckbox,
        BaseInput
    ],
    animations: [
        fadeInOut
    ],
    template: `
    <form [formGroup]="formGroup" (submit)="onSubmit()" class="flex flex-col gap-2 w-full">
        <legend class="font-gothamBold text-2xl">Add Awesome Url 🪄</legend>
        
        <div class="flex gap-2">
            <request-url-metadata-input 
                label="URL"
                formControlName="url"
                (resultEvent)="onLoadMetaData($event)"
            />
        </div>

        @if (loadMetaData) {
            <div class="flex flex-col w-full" @fadeInOut>
                <base-input label="제목" formControlName="title" readonly/>

                <base-input label="설명" formControlName="description" readonly/>

                <br/>

                <span class="text-sm">썸네일</span>
                <div class="rounded-xl overflow-hidden h-[100px] flex justify-center items-center border">
                    <img [src]="formGroup.value.thumbnail" class="min-h-[100px]" />
                </div>

                <br/>

                <div class="grid grid-cols-2 gap-2" formArrayName="categories">
                    @for (control of categories.controls; track $index;) {
                        <div [formGroupName]="$index">
                            <category-checkbox 
                                [id]="control.get('id')?.value"
                                [name]="control.get('name')?.value"
                                formControlName="checked"
                            />
                        </div>
                    }
                </div>

                <br/>

                <button class="btn w-full">등록</button>
            </div>
        }
    </form>
    `
})
export class AddPostFormWidget {

    loadMetaData = false;

    formGroup!: FormGroup;

    private readonly formBuilder = inject(FormBuilder);

    private readonly destroyRef = inject(DestroyRef);

    private readonly categoryService = inject(CategoryService);

    private readonly postService = inject(PostService);

    constructor() {
        this.initFormGroup();

        this.categoryService.getCategories().pipe(
            tap(state => this.addFromArrayItems(state.items)),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    get categories() {
        return this.formGroup.get('categories') as FormArray;
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
        const { categories, ...dto  } = this.formGroup.value;
        console.log(categories);
        const categoryIds = (categories as any[])
            .filter(category => !!category.checked)
            .map(category => category.id);

        console.log(categoryIds);
        this.postService.addPost({ ...dto, categoryIds }).subscribe();
    }

    private initFormGroup() {
        this.formGroup = this.formBuilder.group({
            url: this.formBuilder.control(''),
            title: this.formBuilder.control(''),
            description: this.formBuilder.control(''),
            thumbnail: this.formBuilder.control(''),
            categories: new FormArray([])
        });
    }

    private addFromArrayItems(categories: CategoryModel[]) {
        const formArray = this.formGroup.get('categories') as FormArray;

        categories.forEach(category =>
            formArray.push(
                new FormGroup({
                    checked: new FormControl(false),
                    name: new FormControl(category.name),
                    id: new FormControl(category.id)
                })
            )
        );
    }
}