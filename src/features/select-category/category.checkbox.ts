import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


@Component({
    selector: 'category-checkbox',
    standalone: true,
    imports: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CategoryCheckbox),
            multi: true
        }
    ],
    template: `
    <button 
    class="w-full p-2 text-sm border-2 border-black rounded-md flex justify-between items-center" >
        <span class="truncate">{{label}}</span>
        <input type="checkbox" [checked]="isChecked" />
    </button>
    `
})
export class CategoryCheckbox implements ControlValueAccessor {

    @Input() label: string = '';

    isChecked: boolean = false;

    onChange = (value: any) => {
        console.log(value);
    };

    onTouched = () => {};

    writeValue(obj: any): void {
        console.debug('writeValue', obj);
        this.onChange(obj);
    }

    registerOnChange(fn: any): void {
        console.debug('registerOnChange', fn);
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
        console.debug('registerOnTouched', fn);
    }

    setDisabledState?(isDisabled: boolean): void {
        console.debug('setDisabledState', isDisabled);
    }
}