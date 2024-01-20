import { Direction, GameModeConfiguration, Positions } from '@/types';
import { deepCopy } from '@/utils';
import { Board } from './Board';

export class Engine {
  gameModeConfiguration!: GameModeConfiguration;

  #board!: Board;

  isGameOver = true;

  private isPast2048 = false;

  onWinCallback: () => void;

  onLoseCallback: () => void;

  constructor(onWinCallback = () => {}, onLoseCallback = () => {}) {
    this.onWinCallback = onWinCallback;
    this.onLoseCallback = onLoseCallback;
  }

  get positions() {
    return this.#board.positions;
  }

  get score() {
    return this.#board.score;
  }

  createBoard(
    columns: number,
    rows: number,
    state?: {
      positions: Positions;
      score: number;
    }
  ) {
    this.gameModeConfiguration = {
      columns,
      rows,
    };

    this.restart();

    if (state) {
      this.#board.setState(state);
    }
  }

  restart() {
    this.#board = new Board(this.gameModeConfiguration.columns, this.gameModeConfiguration.rows);
    this.isGameOver = false;
  }

  isMoveValid(direction: Direction): boolean {
    if (this.isGameOver) return false;
    const boardCopy = this.#board.copy();
    boardCopy.move(direction);

    const boardNotChanged = boardCopy.positions.every((row, rowIndex) => {
      return row.every((field, columnIndex) => {
        return field === this.#board.positions[rowIndex][columnIndex];
      });
    });

    return !boardNotChanged;
  }

  move(direction: Direction): void {
    if (this.isGameOver) return;
    const oldBoard = deepCopy(this.#board.positions);
    this.#board.move(direction);

    const boardNotChanged = oldBoard.every((row, rowIndex) => {
      return row.every((field, columnIndex) => {
        return field === this.#board.positions[rowIndex][columnIndex];
      });
    });
    if (boardNotChanged) {
      return;
    }

    const numberOfWinFields = this.#board.positions.flat().filter((f) => f === 2048).length;

    if (numberOfWinFields > 0 && !this.isPast2048) {
      this.onWinCallback();
      this.isPast2048 = true;
      return;
    }

    this.#board.spawnNewField();
    const hasEmptyFields = this.#board.positions.flat().includes(undefined);
    if (!hasEmptyFields && Object.values(Direction).every((d) => !this.isMoveValid(d))) {
      this.onLoseCallback();
      this.isGameOver = true;
    }
  }
}
