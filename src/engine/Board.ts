/* eslint-disable no-continue */
import { Direction, FieldValue } from '@/types';
import { generate2dFields } from '@/utils';

export class Board {
  private columns: number;

  private rows: number;

  #score = 0;

  #positions: FieldValue[][];

  constructor(columns: number, rows: number) {
    this.columns = columns;
    this.rows = rows;

    // First: Generate 2d field
    this.#positions = this.generate2dFields();
    this.spawnNewField();
    this.spawnNewField();
  }

  get score(): number {
    return this.#score;
  }

  get positions(): ReadonlyArray<ReadonlyArray<FieldValue>> {
    return this.#positions;
  }

  setState(positions: ReadonlyArray<ReadonlyArray<FieldValue>>, score: number) {
    this.#positions = positions.map((row) => [...row]);
    this.#score = score;
  }

  private generate2dFields(): FieldValue[][] {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return generate2dFields<FieldValue>(this.rows, this.columns, undefined);
  }

  move(direction: Direction): void {
    switch (direction) {
      case Direction.Up: {
        this.moveUp();
        break;
      }
      case Direction.Right: {
        this.moveRight();
        break;
      }
      case Direction.Down: {
        this.moveDown();
        break;
      }
      case Direction.Left: {
        this.moveLeft();
        break;
      }
      default: {
        break;
      }
    }
  }

  private moveUp(): void {
    const newPositions = this.generate2dFields();

    for (let column = 0; column < this.columns; column += 1) {
      let newRow = 0;
      for (let row = 0; row < this.rows; row += 1) {
        if (this.#positions[row][column] === undefined) continue;

        const newPositionsValue = newPositions[newRow][column];
        if (newPositionsValue) {
          if (newPositionsValue === this.#positions[row][column]) {
            // combine fields if they are the same
            newPositions[newRow][column] = newPositionsValue * 2;
            this.#score += newPositionsValue * 2;
          } else {
            // move field to the next row if it is not the same
            newPositions[newRow + 1][column] = this.#positions[row][column];
          }
          // target next row after merging attempt
          newRow += 1;
        } else {
          // move field into empty field
          newPositions[newRow][column] = this.#positions[row][column];
        }
      }
    }

    this.#positions = newPositions;
  }

  private moveDown(): void {
    const newPositions = this.generate2dFields();

    for (let column = 0; column < this.columns; column += 1) {
      let newRow = this.rows - 1;
      for (let row = this.rows - 1; row >= 0; row -= 1) {
        if (this.#positions[row][column] === undefined) continue;

        const newPositionsValue = newPositions[newRow][column];
        if (newPositionsValue) {
          if (newPositionsValue === this.#positions[row][column]) {
            // combine fields if they are the same
            newPositions[newRow][column] = newPositionsValue * 2;
            this.#score += newPositionsValue * 2;
          } else {
            // move field to the next row if it is not the same
            newPositions[newRow - 1][column] = this.#positions[row][column];
          }
          // target next row after merging attempt
          newRow -= 1;
        } else {
          // move field into empty field
          newPositions[newRow][column] = this.#positions[row][column];
        }
      }
    }

    this.#positions = newPositions;
  }

  private moveRight(): void {
    const newPositions = this.generate2dFields();

    for (let row = 0; row < this.rows; row += 1) {
      let newColumn = this.columns - 1;
      for (let column = this.columns - 1; column >= 0; column -= 1) {
        if (this.#positions[row][column] === undefined) continue;

        const newPositionsValue = newPositions[row][newColumn];
        if (newPositionsValue) {
          if (newPositionsValue === this.#positions[row][column]) {
            // combine fields if they are the same
            newPositions[row][newColumn] = newPositionsValue * 2;
            this.#score += newPositionsValue * 2;
          } else {
            // move field to the next column if it is not the same
            newPositions[row][newColumn - 1] = this.#positions[row][column];
          }
          // target next column after merging attempt
          newColumn -= 1;
        } else {
          // move field into empty field
          newPositions[row][newColumn] = this.#positions[row][column];
        }
      }
    }

    this.#positions = newPositions;
  }

  private moveLeft(): void {
    const newPositions = this.generate2dFields();

    for (let row = 0; row < this.rows; row += 1) {
      let newColumn = 0;
      for (let column = 0; column < this.columns; column += 1) {
        if (this.#positions[row][column] === undefined) continue;

        const newPositionsValue = newPositions[row][newColumn];
        if (newPositionsValue) {
          if (newPositionsValue === this.#positions[row][column]) {
            // combine fields if they are the same
            newPositions[row][newColumn] = newPositionsValue * 2;
            this.#score += newPositionsValue * 2;
          } else {
            // move field to the next column if it is not the same
            newPositions[row][newColumn + 1] = this.#positions[row][column];
          }
          // target next column after merging attempt
          newColumn += 1;
        } else {
          // move field into empty field
          newPositions[row][newColumn] = this.#positions[row][column];
        }
      }
    }

    this.#positions = newPositions;
  }

  spawnNewField() {
    const emptyFields = this.#positions
      .flatMap((row, rowIndex) =>
        row.map((field, columnIndex) => ({ field, rowIndex, columnIndex }))
      )
      .filter(({ field }) => field === undefined);

    if (emptyFields.length === 0) {
      return;
    }

    const randomEmptyField = emptyFields[Math.floor(Math.random() * emptyFields.length)];

    const random = Math.random();
    this.#positions[randomEmptyField.rowIndex][randomEmptyField.columnIndex] = random < 0.9 ? 2 : 4;
  }

  copy(): Board {
    const board = new Board(this.columns, this.rows);
    board.setState(this.#positions, this.score);
    return board;
  }
}
