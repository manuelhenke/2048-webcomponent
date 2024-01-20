import { Positions } from '@/types';
import { deepCopy } from '@/utils';

interface EventDetail {
  positions: Positions;
}

export class Event<T = void> extends CustomEvent<T & EventDetail> {
  constructor(type: string, positions: Positions, eventInitDict: CustomEventInit<T> = {}) {
    const { detail, ...eventInitDictWithoutDetail } = eventInitDict;

    super(`2048:${type}`, {
      detail: {
        positions: deepCopy(positions),
        ...detail,
      } as T & EventDetail,
      bubbles: true,
      composed: true,
      cancelable: false,
      ...eventInitDictWithoutDetail,
    });
  }
}
