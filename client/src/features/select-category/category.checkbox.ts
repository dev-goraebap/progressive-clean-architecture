import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";


@Component({
    selector: 'category-checkbox',
    standalone: true,
    imports: [
        FormsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CategoryCheckbox),
            multi: true
        }
    ],
    template: `
    <label 
    [htmlFor]="id"
    class="w-full p-2 text-sm border rounded-xl flex justify-between items-center cursor-pointer">
        <span class="truncate">{{name}}</span>
        <input [id]="id" type="checkbox" class="checkbox" [checked]="value" (click)="onChecked()"/>
    </label>
    `
})
export class CategoryCheckbox implements ControlValueAccessor {

    @Input() id!: string;
    @Input() name!: string;

    value: boolean = false;

    onChecked() {
        this.value = !this.value;
        this._onChange(this.value);
        this._onTouched();
    }

    // # implementation of ControlValueAccessor

    writeValue(value: boolean): void {
        if (typeof value !== 'boolean') {
            throw new Error('Boolean 타입만 입력 가능');
        }
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    private _onChange = (_: boolean) => { };

    private _onTouched = () => { };
}