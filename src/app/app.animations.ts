import {
  trigger,
  state,
  style,
  animate,
  group,
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
    ]),
  ]);

export const fadeInOut =
  trigger('fadeInOut', [
    state('void', style({
      opacity: 0,
      transform: 'scale(0.8)',
      height: '1px',
    })),
    state('*', style({
      opacity: '0.8',
      transform: 'scale(1)',
      height: '*',
    })),

    transition(':enter', [
      style({ opacity: '0', transform: 'scale(0.8)', height: '0' }),
      group([
        animate('.15s ease-in', style({ height: '*' })),
        animate('.2s ease-in', style({ transform: 'scale(1)' })),
        animate('.3s ease-in', style({ opacity: '0.8' })),
      ]),
    ]),

    transition(':leave', [
      group([
        animate('.2s ease-out', style({ transform: 'scale(0.8)' })),
        animate('.25s ease-out', style({ opacity: '0' })),
        animate('.1s .25s ease-out', style({ height: '0' })),
      ]),
    ]),
  ]);
