import { Board } from '@/engine';
import { Event } from './event';

export class GameLostEvent extends Event {
  constructor(board: Board) {
    super('game-lost', board);
  }
}
