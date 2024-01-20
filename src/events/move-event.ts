import { Positions, Direction } from '@/types';
import { Event } from './event';

interface MoveEventDetail {
  direction: Direction;
}

export class MoveEvent extends Event<MoveEventDetail> {
  constructor(positions: Positions, detail: MoveEventDetail) {
    super('move', positions, {
      cancelable: true,
      detail,
    });
  }
}
