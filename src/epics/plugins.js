// @flow

import { ofType } from 'redux-observable';
import { tap, ignoreElements } from 'rxjs/operators';

export const announcePlugin = (action$: ActionsObservable) => action$.pipe(
  ofType('PLUGIN_INIT'),
  tap((action) => {
    console.info(`Loaded plugin: ${action.name}`);
  }),
  ignoreElements(),
);

export default [announcePlugin];
