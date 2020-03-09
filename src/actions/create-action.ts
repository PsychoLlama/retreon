import { ActionConstant } from '../types/actions';
import { CreateAction } from '../types/create-action';
import { isFailure, getValue } from './failure';
import createAsyncAction from './create-async-action';
import bindActionType from './bind-action-type';
import validateActionType from './validate-action-type';

// Synchronous action creator.
//
// Example:
// createAction('add-file', file => {
//   return { url: URL.createObjectURL(file) }
// })
const createAction = (actionType: ActionConstant, effect?: Function) => {
  validateActionType(actionType);

  const executeEffectAndReturnAction = (input: any) => {
    if (effect === undefined) {
      if (input === undefined) {
        return { type: actionType };
      }

      return { type: actionType, payload: input };
    }

    const payload = effect(input);

    if (isFailure(payload)) {
      return {
        type: actionType,
        error: true,
        payload: getValue(payload),
      };
    }

    return { type: actionType, payload };
  };

  return bindActionType(actionType, executeEffectAndReturnAction);
};

// Asynchronous action creator.
//
// Example:
// createAction.async('update-profile-photo', async photo => {
//   await http.put('/users/self/profile-photo/', photo)
// })
createAction.async = createAsyncAction;

// These types become completely unmaintainable when you try to write them
// with the implementation. It's *significantly* easier to keep them in
// a separate file and re-cast the implementation to a more precise type.
export default (createAction as unknown) as CreateAction;