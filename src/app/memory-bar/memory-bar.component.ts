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
 * A 'memory bar' or a set of controls related to quaternion memory management that can be inserted into a calculator.  Currently
 * 'M+' (add to memory) and 'MR' (recall from memory).
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Component, OnInit, Input } from '@angular/core';
import { Store                    } from '@ngrx/store';

import { M_ADD, 
         M_RECALL                 } from '../shared/Actions';
import { Calculator               } from '../shared/ICalculator';

@Component({
  selector: 'app-memory-bar',
  
  inputs: ['id'],

  template: `
    <div class="pull-right">
      <button class="btn-small btn-primary qc-memory-pad-right" (click)="__onMemoryAdd()">M+</button>
      <button class="btn-small btn-primary qc-memory-pad-right" (click)="__onMemoryRecall()">MR</button>
    </div>`,

  styles: ['.qc-memory-pad-right{ margin-right:8px }']
})

export class MemoryBarComponent implements OnInit 
{
  public id: string;       // unique id assigned to and instance of this component by its parent

 /**
  * Construct a new MemoryBarComponent
  *
  * @param _store: Store<Calculator> Injected store for the calculator
  *
  * @return Nothing - You could just as easily use outputs and an EventEmitter to indicate memory operations; this
  * simply illustrates how to have multiple dispatches from different components inside an application.  Nothing more.
  */
  constructor(private _store:Store<Calculator>)
  {
  }

  ngOnInit() 
  {
    // empty
  }

  // you don't have to handle events this way - this just shows how easy it is to plug a compoment in anywhere and it 
  // fits into the Flux-style flow.  And, if you are familiar with Flux, you already know how this component fits into
  // the application without knowning anything else about the application :)
  private __onMemoryAdd():void
  {
    this._store.dispatch( {type:M_ADD, payload:this.id} );
  }

  private __onMemoryRecall():void
  {
    this._store.dispatch( {type:M_RECALL, payload:this.id} );
  }
}
