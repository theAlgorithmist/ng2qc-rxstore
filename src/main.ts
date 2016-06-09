import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Ng2qcRxstoreAppComponent, environment } from './app/';

// Calculator store
import { provideStore } from '@ngrx/store';
import { ObjReducer } from './app/shared/ObjReducer';

if (environment.production) {
  enableProdMode();
}

bootstrap( Ng2qcRxstoreAppComponent, [provideStore({ calculator: ObjReducer })] );

