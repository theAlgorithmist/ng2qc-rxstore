/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Quaternion calculator component, using @ngrx/store as a store
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0 (this version of the calculator dynamically updates the result whenever a single quaternion element changes
 * as long as there is a valid operation 'in progress')
 */

// angular goodies
import { Component, ViewChild } from '@angular/core';

// other components used in the layout
import { QuaternionComponent  } from './quaternion/quaternion.component';
import { MemoryBarComponent   } from './memory-bar/memory-bar.component';

// Typescript Math Toolkit Quaternion
import { TSMT$Quaternion      } from './shared/lib/Quaternion';

// Store and various actions
import { Store       } from '@ngrx/store';
import { Subject     } from 'rxjs/Subject';

import { Q1_CHANGE, 
         Q2_CHANGE, 
         OP_CHANGE, 
         M_ADD, 
         M_RECALL, 
         M_RECALL_1,
         M_RECALL_2,
         CLEAR,
         NONE        } from './shared/Actions';

import { OpEnum      } from './shared/Actions';
import { Q           } from './shared/ObjReducer'; 
import { Calculator  } from './shared/ICalculator';

@Component({
  selector: 'ng2qc-rxstore-app',

  template: `
  <!-- Quaternion Calculator ... this is about the biggest template I would inline -->
  <div class="container-fluid rounded">
    <div class="row">
      <img class="img-responsive qc-logo-img" src="eyes.png">
      <div>
        <span class="pull-left">The Algorithmist</span>
        <span class="pull-right" > Quaternion Calculator</span>
      </div>
    </div>

    <!-- First input quaternion and memory operations -->
    <div class="row qc-centered" >
      <app-quaternion #q1 [title]="aTitle" read="" (change)="onQuaternionChanged($event)" >
      </app-quaternion>  
    </div>
    <app-memory-bar id="Q_1"></app-memory-bar>

    <!-- Operations -->
    <div class="row qc-pad-top" >
      <div class="qc-operation-bar qc-centered">
        <img (click)="onAdd()" class="qc-operation-img" id= "add" src= "plus.png" border= "0" width= "30" height= "30" />
        <img (click)="onSubtract()" class="qc-operation-img" id= "sub" src= "minus.png" width= "30" height= "30" />
        <img (click)="onMultiply()" class="qc-operation-img" id= "mul" src= "multiply.png" width= "30" height= "30" />
        <img (click)="onDivide()" class="qc-operation-img" id= "div" src= "divide.png" width= "30" height= "30" /> 
      </div>
    </div>

    <!-- Second input quaternion and memory operations -->
    <div class="row qc-centered qc-pad-top" >
      <app-quaternion #q2 [title]="bTitle" read="" (change)="onQuaternionChanged($event)" >
      </app-quaternion>  
    </div>
    <app-memory-bar id="Q_2"></app-memory-bar>

    <!-- push this way down to differentiate from the input quaternions and memory bars -->
    <div class="row qc-centered qc-pad-extra">
      <span class="largeText"> = </span>
    </div>

    <!-- Result quaternion -->
    <div class="row qc-centered qc-pad-top">
      <app-quaternion #result [title]="resTitle" read="readonly"></app-quaternion>  
    </div>

    <!-- Clear the calculator -->
    <div class="row qc-centered qc-pad-top">
      <span (click)="onClear()" class="pull-right"> <button type="button" class="btn-sm btn-success"> Clear </button></span>
    </div>
  </div>`,

  directives: [ QuaternionComponent, MemoryBarComponent ],  

  styles: [`
    .qc-logo-img            { float:left; margin-right:6px }
    .qc-right               { float:right; }
    .qc-pad-bottom          { padding-bottom:30px; }
    .qc-pad-top             { margin-top:15px; }
    .qc-pad-extra           { margin-top:50px; }
    .qc-centered            { display: flex; align-items: center; justify-content: center; }
    .qc-operation-bar       { margin-top:20px; margin-bottom:20px; }
    .qc-operation-img       { border: 2px solid #0D4F8B; border-radius: 50%; margin-right:15px; }
    .qc-operation-img:hover { border: 2px solid #ff3333; cursor:pointer; }
  `]
})

// Yes, this is a verbose class name, but it serves to differentiate different versions of the quaternion calculator and that
// this example uses @ngrx/store
export class Ng2qcRxstoreAppComponent
{
  // public calculator properties
  public aTitle: string   = "Quaternion A";          // title of first input quatertion
  public bTitle: string   = "Quaternion B";          // title of second intput quaternion
  public resTitle: string = "Result";                // title of result quaternion

  // references to quaternion display elements from the view (available after view init)
  @ViewChild('q1') _q1_:QuaternionComponent;         // quaternion 1 
  @ViewChild('q2') _q2_:QuaternionComponent;         // quaternion 2
  @ViewChild('result') _r_:QuaternionComponent;      // result

  // mathematical representation of the two internal quaternions. although these store data, they are not part of the
  // calculator model.  instead, they are used to encapsulate the mathematical complexity of dealing with quaternion
  // arithmetic inside an API.  The second quaternion is also used to hold the result of an operation.
  private _q1: TSMT$Quaternion = new TSMT$Quaternion();; 
  private _q2: TSMT$Quaternion = new TSMT$Quaternion();;

  // reference to the calculator model (Subject)
  private _calculator:Subject<Object>;

  // current calculator operation and most recent action
  private _operation: number;
  private _action: string;

 /**
  * Construct a new NG2qcRxStoreComponent
  *
  * @param _store: Store<Calculator> Injected store for the calculator
  *
  * @return Nothing 
  */
  constructor(private _store:Store<Calculator>)
  {
    // internal reference to the calculator model
    this._calculator = <Subject<Object>> this._store.select('calculator');

    // subscribe to updates from the calculator (create a 'delegate' to an existing class method)
    this._calculator.subscribe( (calculator:Object) => {this.__update(calculator)});

    // the calculator begins with no active operation
    this._operation = OpEnum.NONE;
  }

 /**
  * Subscribe to quaternion changes from the QuaternionComponent
  *
  * @param evt: any dispatching context (should be a QuaternionComponent)
  *
  * @return Nothing - send an action to the store.
  */
  public onQuaternionChanged(evt: any) 
  {
    if (evt instanceof QuaternionComponent) 
    {
      // reference to the quaternion that changed
      var quaternion: QuaternionComponent = <QuaternionComponent> evt;

      // the changed quaternion's values
      var q: Q = new Q(quaternion.w, quaternion.i, quaternion.j, quaternion.k);

      // quaternion change currently based on title property
      var action: string = quaternion.title == this.aTitle ? Q1_CHANGE : Q2_CHANGE;

      // dispatch the change to the store
      this._store.dispatch( {type:action, payload:q} );
    }
  }

 /**
  * Dispatch an op-change if the user clicks the 'add' button
  *
  * @return Nothing
  */
  public onAdd(): void 
  {
    this._store.dispatch({ type:OP_CHANGE, payload:OpEnum.ADD });
  }

 /**
  * Dispatch an op-change if the user clicks the 'subtract' button
  *
  * @return Nothing
  */
  public onSubtract(): void 
  {
    this._store.dispatch({ type:OP_CHANGE, payload:OpEnum.SUBTRACT });
  }

 /**
  * Dispatch an op-change if the user clicks the 'multiply' button
  *
  * @return Nothing
  */
  public onMultiply(): void 
  {
    this._store.dispatch({ type:OP_CHANGE, payload:OpEnum.MULTIPLY });
  }

 /**
  * Dispatch an op-change if the user clicks the 'divide' button
  *
  * @return Nothing 
  */
  public onDivide(): void 
  {
    this._store.dispatch({ type:OP_CHANGE, payload:OpEnum.DIVIDE });
  }

 /**
  * Dispatch clear if the user clicks the 'Clear' button
  *
  * @return Nothing
  */
  public onClear(): void 
  {
    this._store.dispatch({ type: CLEAR }); // no payload on a clear
  }

 /**
  * Angular 2 life cycle method, implemented on component destruction
  *
  * @return Nothing
  */
  public ngOnDestroy()
  {
    this._calculator.unsubscribe();
  }

  // handle calculator updates
  private __update(calculator: Object): void
  {
    // load the (expected) quaternion values from the model
    var q: Q = calculator['q1'];
    this._q1.fromArray( [q.w, q.i, q.j, q.k] );

    q = calculator['q2'];
    this._q2.fromArray( [q.w, q.i, q.j, q.k] );

    // the following actions produce a display update
    switch (calculator['action'])
    {
      case Q1_CHANGE:
      case Q2_CHANGE:
        this.__updateDisplay();
      break;

      case OP_CHANGE:
        this._operation = calculator['op'];
        this.__updateDisplay();
      break;
 
      case M_RECALL_1:
        q = calculator['q1m'];
        this._q1.fromArray( [q.w, q.i, q.j, q.k] );

        // update quaternion-1 values in the UI
        this._q1_.w = q.w;
        this._q1_.i = q.i;
        this._q1_.j = q.j;
        this._q1_.k = q.k;

        this.__updateDisplay();
      break;

      case M_RECALL_2:
        q = calculator['q2m'];
        this._q2.fromArray( [q.w, q.i, q.j, q.k] );

        // update quaternion-2 values in the UI
        this._q2_.w = q.w;
        this._q2_.i = q.i;
        this._q2_.j = q.j;
        this._q2_.k = q.k;

        this.__updateDisplay();
      break;

      case CLEAR:
        // update the UI to reflect values placed in the model on clear
        q = calculator['q1'];
        this._q1_.w = q.w;
        this._q1_.i = q.i;
        this._q1_.j = q.j;
        this._q1_.k = q.k;

        q = calculator['q2'];
        this._q2_.w = q.w;
        this._q2_.i = q.i;
        this._q2_.j = q.j;
        this._q2_.k = q.k;

        // result is the same value
        this._r_.w = q.w;
        this._r_.i = q.i;
        this._r_.j = q.j;
        this._r_.k = q.k;

        this._operation = OpEnum.NONE;
      break;
    }
  }

  // update the calculator (result) display
  private __updateDisplay(): void
  {
    if (this._operation == OpEnum.NONE)
      return;

    switch (this._operation)
    {
      case OpEnum.ADD:
        this._q1.add(this._q2);
        this.resTitle = "Result: ADD";
      break;

      case OpEnum.SUBTRACT:
        this._q1.subtract(this._q2);
        this.resTitle = "Result: SUBTRACT";
      break;
      
      case OpEnum.MULTIPLY:
        this._q1.multiply(this._q2);
        this.resTitle = "Result: MULTIPLY";
      break;

      case OpEnum.DIVIDE:
        this._q1.divide(this._q2);
        this.resTitle = "Result: DIVIDE";
      break;
    }

    // update result quaternion
    let q: Object = this._q1.toObject();
    this._r_.w = parseFloat(q['w']);
    this._r_.i = parseFloat(q['i']);
    this._r_.j = parseFloat(q['j']);
    this._r_.k = parseFloat(q['k']);
  }
}
