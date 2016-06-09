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
 * A single quaternion that may be used interactively or for display only
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quaternion',

  inputs: ['title', 'read'],

  template: `
   <div>
     <p>{{title}}</p>
     <label>W: </label><input #wInput class="qc-input qc-rightSpace" type="number" value={{w}} readonly={{read}} (keydown)="__onKeyDown($event)" (change)="onWChanged(wInput.value)" />
     <label>I: </label><input #iInput class="qc-input qc-rightSpace" type="number" value={{i}} readonly={{read}} (keydown)="__onKeyDown($event)" (change)="onIChanged(iInput.value)" />
     <label>J: </label><input #jInput class="qc-input qc-rightSpace" type="number" value={{j}} readonly={{read}} (keydown)="__onKeyDown($event)" (change)="onJChanged(jInput.value)" />
     <label>K: </label><input #kInput class="qc-input" type="number" value={{k}} readonly={{read}} (keydown)="__onKeyDown($event)" (change)="onKChanged(kInput.value)" />
   </div>`,

  styles: [`
    .qc-input {
      width:50px;
      display:inline;
      border: 1px solid #999;
      -webkit-box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
      -moz-box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
      -o-box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
    }

    .qc-rightSpace { margin-right:20px; }
  `]
})

export class QuaternionComponent implements OnInit
{
  // change event - emitted when quaternion values change due to user input
  @Output() change: EventEmitter<any> = new EventEmitter();

  // quaternion component inputs
  public title: string;             // title for this display, i.e. 'quaternion A' or 'quaternion 1'
  public read:string;               // specify readonly attribute for inputs

  // quaternion values (exercise: make these accessable/changeable only through getter/setter)
  public w: number = 0;             // real component
  public i: number = 0;             // i-component
  public j: number = 0;             // j-component
  public k: number = 0;             // k-component

  constructor()
  {
    // empty
  }

 /**
  * onInit Angular 2 life cycle handler
  *
  * @return nothing - placeholder for future use
  */
  ngOnInit()
  {
  }

 /**
  * change handler for w-component
  *
  * @param value: number - candidate for new w value
  *
  * @return nothing - changes the w-component of the quaternion if the input is a valid number and emits 'change'
  */
  public onWChanged(value: number): boolean
  {
    this.w = isNaN(value) && isFinite(value) ? this.w : value;
    this.change.next(this);

    return false;
  }

 /**
  * change handler for i-component
  *
  * @param value: number - candidate for new i value
  *
  * @return nothing - changes the i-component of the quaternion if the input is a valid number and emits 'change'
  */
  public onIChanged(value: number): boolean
  {
    this.i = isNaN(value) && isFinite(value) ? this.i : value;
    this.change.next(this);

    return false;
  }

 /**
  * change handler for j-component
  *
  * @param value: number - candidate for new j value
  *
  * @return nothing - changes the j-component of the quaternion if the input is a valid number and emits 'change'
  */
  public onJChanged(value: number): boolean
  {
    this.j = isNaN(value) && isFinite(value) ? this.j : value;
    this.change.next(this);

    return false;
  }

 /**
  * change handler for k-component
  *
  * @param value: number - candidate for new k value
  *
  * @return nothing - changes the k-component of the quaternion if the input is a valid number
  */
  public onKChanged(value: number): boolean
  {
    this.k = isNaN(value) && isFinite(value) ? this.k : value;
    this.change.next(this);

    return false;
  }

  // an old-school key-down handler - feel free to change this
  private __onKeyDown(evt: any): boolean
  {
    var code: number = evt.keyCode;

    // could do evt.preventDefault() which is probably the better way on modern browsers, but I'm feeling old-school today - make this more robust
    // as you see fit (for example, this does not support a numeric keypad)
    return (code > 47 && code < 59) || code == 173 || code == 189 || code == 190 || code == 46 || code == 8 || code == 37 || code == 39 || code == 9;
  }
}
