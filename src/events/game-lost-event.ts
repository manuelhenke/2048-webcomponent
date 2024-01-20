import { Positions } from '@/types';
import { Event } from './event';

export class GameLostEvent extends Event {
  constructor(positions: Positions) {
    super('game-lost', positions);
  }
}
