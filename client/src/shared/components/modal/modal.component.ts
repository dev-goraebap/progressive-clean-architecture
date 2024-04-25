import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, DestroyRef, ViewChild, ViewContainerRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { tap } from "rxjs";

import { fadeInOut, slideInOut } from "src/shared";

import { ModalController, ModalState } from "./modal.controller";

@Component({
    selector: 'modal-component',
    standalone: true,
    imports: [CommonModule],
    animations: [
        fadeInOut,
        slideInOut
    ],
    template: `
    @if (state?.opened) {
        <div
            @fadeInOut
            (click)="onClose()" 
            class="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div
                (click)="$event.stopPropagation()"
                class="w-full h-full sm:h-auto sm:w-[500px] p-4 sm:rounded-xl bg-white flex flex-col gap-2">
                <button (click)="onClose()" class="w-10 block sm:hidden">
                    <svg viewBox="0 0 1024 1024" fill="#000000" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z" fill=""></path></g></svg>
                </button>
                <div #contentView></div>
            </div>
        </div>
    }
    `
})
export class ModalComponent implements AfterViewInit {

    @ViewChild('contentView', { read: ViewContainerRef })
    contentView!: ViewContainerRef;

    state?: ModalState;

    private readonly controller = inject(ModalController);

    private readonly destroyRef = inject(DestroyRef);

    ngAfterViewInit(): void {
        this.controller.state$.pipe(
            tap(state => {
                this.state = state;
                
                this.initContentView();       
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    onClose() {
        this.controller.close();
    }

    private initContentView() {
        if (!this.state?.component) {
            return;
        }

        setTimeout(() => {
            this.contentView.clear();
            this.contentView.createComponent(this.state?.component);
        });
    }
}