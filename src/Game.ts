/* eslint-disable @typescript-eslint/unbound-method */
import { html, unsafeCSS, LitElement } from 'lit';
import { eventOptions, property, state } from 'lit/decorators.js';
import { Engine } from '@/engine';
import { GameWonEvent, GameLostEvent, MoveEvent } from '@/events';
import { Direction, GameModeConfiguration } from '@/types';
import Style from './style.scss';

/**
 * @fires {GameWonEvent} 2048:game-won - User just won the game
 * @fires {GameLostEvent} 2048:game-lost - User just lost the game
 * @fires {MoveEvent} 2048:move - User moved
 */
export class Game extends LitElement {
  static get styles() {
    return unsafeCSS(Style);
  }

  @property({
    attribute: 'restart-selector',
    type: String,
  })
  restartSelector?: string;

  @property({
    attribute: 'swipe-distance-threshold',
    type: Number,
  })
  swipeDistanceThreshold = 50;

  @property({
    type: Number,
  })
  columns = 4;

  @property({
    type: Number,
  })
  rows = 4;

  @state({})
  private moveStart?: { x: number; y: number };

  @state({})
  private engine: Engine;

  constructor() {
    super();

    this.engine = new Engine(this.gameWonCallback.bind(this), this.gameLostCallback.bind(this));
  }

  connectedCallback() {
    // @ts-expect-error: super.connectedCallback always defined
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    if (this.restartSelector) {
      const restartElements = document.querySelectorAll(this.restartSelector);
      restartElements.forEach((restartElement) => {
        restartElement.addEventListener('click', this.restartGame.bind(this));
      });
    }

    this.createGameBoard();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    // @ts-expect-error: super.disconnectedCallback always defined
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp': {
        this.move(Direction.Up);
        break;
      }
      case 'ArrowRight': {
        this.move(Direction.Right);
        break;
      }
      case 'ArrowDown': {
        this.move(Direction.Down);
        break;
      }
      case 'ArrowLeft': {
        this.move(Direction.Left);
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();
  }

  private handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.moveStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      event.preventDefault();
    }
  }

  @eventOptions({ passive: false })
  private handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.handleMoveEnd({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      });
    }
  }

  @eventOptions({ passive: false })
  private handleMouseDown(event: MouseEvent) {
    this.moveStart = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  @eventOptions({ passive: false })
  private handleMouseMove(event: MouseEvent) {
    this.handleMoveEnd({
      x: event.clientX,
      y: event.clientY,
    });
  }

  private handleMoveEnd(moveEnd: { x: number; y: number }) {
    if (!this.moveStart) {
      return;
    }

    const xDiff = moveEnd.x - this.moveStart.x;
    const yDiff = moveEnd.y - this.moveStart.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > this.swipeDistanceThreshold) {
        this.move(Direction.Right);
      } else if (xDiff < -this.swipeDistanceThreshold) {
        this.move(Direction.Left);
      }
    } else if (yDiff > this.swipeDistanceThreshold) {
      this.move(Direction.Down);
    } else if (yDiff < -this.swipeDistanceThreshold) {
      this.move(Direction.Up);
    }
  }

  @eventOptions({ passive: false })
  private resetMoveStart() {
    this.moveStart = undefined;
  }

  private move(direction: Direction) {
    this.resetMoveStart();
    if (!this.engine.isMoveValid(direction)) return;
    const allowed = this.dispatchEvent(new MoveEvent(this.engine.board, direction));

    if (!allowed) {
      return;
    }

    this.engine.move(direction);
    this.requestUpdate();
  }

  private createGameBoard() {
    if (this.engine) {
      this.engine.createBoard(this.columns, this.rows);
      this.requestUpdate();
    }
  }

  private gameWonCallback() {
    this.dispatchEvent(new GameWonEvent(this.engine.board));
  }

  private gameLostCallback() {
    this.dispatchEvent(new GameLostEvent(this.engine.board));
  }

  setGameModeConfiguration(gameModeConfiguration: GameModeConfiguration) {
    this.columns = gameModeConfiguration.columns;
    this.rows = gameModeConfiguration.rows;
    this.createGameBoard();
  }

  restartGame() {
    if (this.engine) {
      this.engine.restart();
      this.requestUpdate();
    }
  }

  render() {
    if (!this.engine?.board) {
      return html`No Board :(`;
    }

    const { positions } = this.engine.board;

    return html`
      <div
        class="container"
        @touchstart="${this.handleTouchStart}"
        @touchmove="${this.handleTouchMove}"
        @touchend="${this.resetMoveStart}"
        @mousedown="${this.handleMouseDown}"
        @mousemove="${this.handleMouseMove}"
        @mouseup="${this.resetMoveStart}"
      >
        <div class="box">
          ${positions.map(
            (row) =>
              html`
                <div class="row">
                  ${row.map((field) => html`<div class="field field-${field}">${field}</div>`)}
                </div>
              `
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    '2048:game-won': GameWonEvent;
    '2048:game-lost': GameLostEvent;
    '2048:move': MoveEvent;
  }
}

export default Game;
