import { Positions } from '@/types';
import { Event } from './event';

export class GameWonEvent extends Event {
  constructor(positions: Positions) {
    super('game-won', positions);
  }
}
