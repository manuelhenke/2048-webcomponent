export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type FieldValue = number | undefined;
export type Positions = ReadonlyArray<ReadonlyArray<FieldValue>>;

export interface GameModeConfiguration {
  columns: number;
  rows: number;
  state?: { positions: Positions; score: number };
}
