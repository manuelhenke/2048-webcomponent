import { Positions } from '@/types';
import { Event } from './event';

interface ScoreEventDetail {
  oldScore?: number;
  delta?: number;
  newScore: number;
}

export class ScoreEvent extends Event<ScoreEventDetail> {
  constructor(positions: Positions, detail: ScoreEventDetail) {
    super('score', positions, {
      cancelable: false,
      detail,
    });
  }
}
