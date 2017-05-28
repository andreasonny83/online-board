import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const slideToLeft =
  trigger('routerTransition', [
    state('void', style({ width: '100%' })),
    state('*', style({ width: '100%' })),

    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(100%)',
        position: 'absolute',
      }),
      animate('.3s ease-in-out', style({
        opacity: 1,
        transform: 'translateX(0%)',
      })),
    ]),

    transition(':leave', [
      style({
        opacity: 1,
        transform: 'translateX(0%)',
      }),
      animate('.3s ease-in-out', style({
        opacity: 0,
        transform: 'translateX(-100%)',
      })),
    ])
  ]);

export const fadeIn =
  trigger('fadeIn', [
    state('void', style({ opacity: 1 })),
    state('*', style({ opacity: 1 })),

    transition(':enter', [
      style({ opacity: 0 }),
      animate('.3s ease-in-out', style({ opacity: 1 })),
    ])
  ]);
