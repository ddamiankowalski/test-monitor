import { inject } from '@angular/core';
import { patchState, signalStoreFeature, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { MonitorHttpService } from './monitor-http.service';
import { tapResponse } from '@ngrx/operators';

export const withMonitorMethods = () =>
  signalStoreFeature(
    withMethods((store, httpService = inject(MonitorHttpService)) => {
      /**
       * Retrieves all packages from the backend and saves them inside the store.
       */
      const getPackages = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => httpService.getTestRuns()),
          tapResponse({
            next: (testRuns) => patchState(store, { testRuns }),
            error: () => patchState(store, { isError: true }),
            finalize: () => patchState(store, { isLoading: false }),
          })
        )
      );

      return {
        getPackages,
      };
    })
  );
