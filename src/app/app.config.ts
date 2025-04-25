import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsWebSocketPlugin } from '@ngxs/websocket-plugin';
import { provideStore } from '@ngxs/store';
import { DEVTOOLS_REDUX_CONFIG, LOGGER_CONFIG, OPTIONS_CONFIG, STATES_MODULES } from './store/store.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiKeyInterceptor } from './core/interceptors/api-key.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiKeyInterceptor])),
    provideStore(
      STATES_MODULES,
      OPTIONS_CONFIG,
      withNgxsReduxDevtoolsPlugin(DEVTOOLS_REDUX_CONFIG),
      withNgxsFormPlugin(),
      withNgxsLoggerPlugin(LOGGER_CONFIG),
      withNgxsRouterPlugin(),
      withNgxsStoragePlugin({
        keys: '*'
      }),
      withNgxsWebSocketPlugin())]
};
