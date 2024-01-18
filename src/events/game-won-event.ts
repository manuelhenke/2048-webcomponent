import { Board } from '@/engine';
import { Event } from './event';

export class GameWonEvent extends Event {
  constructor(board: Board) {
    super('game-won', board);
  }
}
