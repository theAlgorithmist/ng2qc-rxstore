import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Ng2qcRxstoreAppComponent } from '../app/ng2qc-rxstore.component';

beforeEachProviders(() => [Ng2qcRxstoreAppComponent]);

describe('App: Ng2qcRxstore', () => {
  it('should create the app',
      inject([Ng2qcRxstoreAppComponent], (app: Ng2qcRxstoreAppComponent) => {
    expect(app).toBeTruthy();
  }));
});
