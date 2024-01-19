import { Board } from '@/engine';
import { Direction } from '@/types';
import { Event } from './event';

interface MoveEventDetail {
  direction: Direction;
}

export class MoveEvent extends Event<MoveEventDetail> {
  constructor(board: Board, direction: Direction) {
    super('move', board, {
      cancelable: true,
      detail: {
        direction,
      },
    });
  }
}
