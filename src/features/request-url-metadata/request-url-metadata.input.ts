import { Component, EventEmitter, Input, Output, forwardRef, inject } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LinkPreviewApi, LinkPreviewMetaData } from "src/shared";


@Component({
    selector: 'request-url-metadata-input',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RequestUrlMetadataInput),
            multi: true
        }
    ],
    styles: [
        `:host {width: 100%;}`
    ],
    template: `
    <label [htmlFor]="'alias-'+label" class="form-control w-full">
        <div class="label">
            <span class="label-text">{{label}}</span>
            <span class="label-text-alt"></span>
        </div>
        <input
            [value]="value"
            [id]="'alias-'+label" 
            (change)="this.onChange($event)"
            [readonly]="readonly"
            type="text" 
            placeholder="Type here" 
            class="input input-bordered w-full" />
        <div class="label hidden">
            <span class="label-text-alt"></span>
            <span class="label-text-alt"></span>
        </div>
    </label>
    `
})
export class RequestUrlMetadataInput implements ControlValueAccessor {

    @Input() label!: string;

    @Input({
        transform: (value: '' | boolean) => {
            if (value === '') return true;
            return value;
        }
    }) readonly?: boolean;

    @Output()
    readonly resultEvent = new EventEmitter<LinkPreviewMetaData>();

    private readonly linkPreviewApi = inject(LinkPreviewApi);

    value: string = '';

    onChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;

        this.value = value;

        this._onChange(value);
        this._onTouched();

        if (!this.value) {
            window.alert('url을 입력해 주세요.');
            return;
        }

        this.linkPreviewApi.getMetaData(this.value)
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

    // # implementation of ControlValueAccessor

    writeValue(value: string): void {
        if (typeof value !== 'string') {
            throw new Error('문자열 타입만 입력 가능');
        }

        this.value = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    private _onChange = (_: any) => { };

    private _onTouched = () => { };
}