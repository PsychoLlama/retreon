import mapActionsToReducers from '../map-actions-to-reducers';
import handleAction from '../handle-action';
import { createAction } from '../../index';
import getActionType from '../get-action-type';

describe('mapActionsToReducers', () => {
  const increment = createAction('increment', () => {});
  const decrement = createAction('decrement', () => {});

  it('returns a map', () => {
    expect(mapActionsToReducers([])).toEqual(expect.any(Map));
  });

  it('adds every action-reducer mapping', () => {
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    const map = mapActionsToReducers([
      handleAction(increment, handleIncrement),
      handleAction(decrement, handleDecrement),
    ]);

    expect(map.get(getActionType(increment))).toMatchObject({
      success: [expect.any(Function)],
    });

    expect(map.get(getActionType(decrement))).toMatchObject({
      success: [expect.any(Function)],
    });
  });

  it('registers reducers in the order they appear', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const map = mapActionsToReducers([
      handleAction(increment, handler1),
      handleAction(increment, handler2),
    ]);

    expect(map.get(getActionType(increment))).toMatchObject({
      success: [expect.any(Function), expect.any(Function)],
      error: [],
      optimistic: [],
    });
  });

  it('adds error handlers to the correct list', () => {
    const handler = jest.fn();

    const map = mapActionsToReducers([handleAction.error(increment, handler)]);

    expect(map.get(getActionType(increment))).toMatchObject({
      success: [],
      error: [expect.any(Function)],
      optimistic: [],
    });
  });

  it('adds optimistic handlers to the correct list', () => {
    const handler = jest.fn();

    const map = mapActionsToReducers([
      handleAction.optimistic(increment, handler),
    ]);

    expect(map.get(getActionType(increment))).toMatchObject({
      success: [],
      error: [],
      optimistic: [expect.any(Function)],
    });
  });
});
