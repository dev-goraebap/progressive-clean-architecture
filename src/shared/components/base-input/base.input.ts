import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'base-input',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BaseInput),
            multi: true
        }
    ],
    template: `
    <label [htmlFor]="'alias-'+label">
        <span class="text-sm">{{label}}</span>
        <input 
            [value]="value"
            [id]="'alias-'+label" 
            class="border-2 border-black rounded-md p-2 w-full"
            (change)="this.onChange($event)"
            [readonly]="readonly"
        />
    </label>
    `
})
export class BaseInput implements ControlValueAccessor {

    @Input() label!: string;

    @Input({
        transform: (value: ''|boolean) => {
            if (value === '') return true;
            return value;
        }
    }) readonly?: boolean;

    value: string = '';

    onChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;

        this.value = value;

        this._onChange(value);
        this._onTouched();
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

    private _onChange = (_: any) => {};

    private _onTouched = () => {};
}