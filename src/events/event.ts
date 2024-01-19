import { Board } from '@/engine';
import { deepCopy } from '@/utils';

interface EventDetail {
  board: Board;
}

export class Event<T = void> extends CustomEvent<T & EventDetail> {
  constructor(type: string, board: Board, eventInitDict: CustomEventInit<T> = {}) {
    const { detail, ...eventInitDictWithoutDetail } = eventInitDict;

    super(`2048:${type}`, {
      detail: {
        board: deepCopy(board),
        ...detail,
      } as T & EventDetail,
      bubbles: true,
      composed: true,
      cancelable: false,
      ...eventInitDictWithoutDetail,
    });
  }
}
