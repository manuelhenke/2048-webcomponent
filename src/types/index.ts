export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export interface GameModeConfiguration {
  columns: number;
  rows: number;
}
