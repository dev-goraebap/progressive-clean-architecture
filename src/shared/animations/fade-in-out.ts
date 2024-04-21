import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
    // 페이드 아웃 상태
    state('void', style({
        opacity: 0
    })),
    // 페이드 인 상태
    state('*', style({
        opacity: 1
    })),
    // 페이드 인
    transition('void => *', animate('200ms ease-in')),
    // 페이드 아웃
    transition('* => void', animate('200ms ease-out'))
]);