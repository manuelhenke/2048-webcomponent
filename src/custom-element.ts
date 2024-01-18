import { Game } from './Game';

window.customElements.define('game-2048', Game);

declare global {
  interface HTMLElementTagNameMap {
    'game-2048': Game;
  }
}
