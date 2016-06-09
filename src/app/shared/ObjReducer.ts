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

 import { Q1_CHANGE, Q2_CHANGE, Q1, Q2, OP_CHANGE, M_ADD, M_RECALL, M_RECALL_1, M_RECALL_2, CLEAR, NONE } from './Actions';
 import { OpEnum } from './Actions';

 import { ActionReducer, Action } from '@ngrx/store';

 // A quaternion value holder named atfer an infamous Star Trek TNG character (preserves immutability in transfer of quaternion data)
 export class Q
 {
   private _w: number = 0;
   private _i: number = 0;
   private _j: number = 0;
   private _k: number = 0;

   constructor (wValue: number, iValue: number, jValue: number, kValue: number)
   {
     this.w = wValue;
     this.i = iValue;
     this.j = jValue;
     this.k = kValue
   }

   get w(): number { return this._w; }
   get i(): number { return this._i; }
   get j(): number { return this._j; }
   get k(): number { return this._k; }

   set w(value: number)
   {
     if( !isNaN(value) && isFinite(value) )
       this._w = value;
   }

   set i(value: number)
   {
     if( !isNaN(value) && isFinite(value) )
       this._i = value;
   }

   set j(value: number)
   {
     if( !isNaN(value) && isFinite(value) )
       this._j = value;
   }

   set k(value: number)
   {
     if( !isNaN(value) && isFinite(value) )
       this._k = value;
   }

   public clone(): Q
   {
     return new Q(this._w, this._i, this._j, this._k);
   }
 }

 // the global model is represented as a property bag of quaternion 1, quaternion 2, quaternion1-memory, quaternion2-memory, and operation
 // performed on the calculator.  Any state of the calcuator can be reproduced exactly from this set of values
 export const ObjReducer: ActionReducer<Object> = (state: Object = {}, action: Action): Object => 
 {
   let obj: Object = action.payload;
   let w: number;
   let i: number;
   let j: number;
   let k: number;

   switch (action.type) 
   {
     // at least one value in quaternion 1 changed
     case Q1_CHANGE:
       w = parseFloat(obj['w']);
       i = parseFloat(obj['i']);
       j = parseFloat(obj['j']);
       k = parseFloat(obj['k']);

       return {q1:new Q(w,i,j,k), q2:state['q2'].clone(), q1m:state['q1m'].clone(), q2m:state['q2m'].clone(), op:state['op'], action:Q1_CHANGE};

     // at least one value in quaternion 2 changed
     case Q2_CHANGE:
       w = parseFloat(obj['w']);
       i = parseFloat(obj['i']);
       j = parseFloat(obj['j']);
       k = parseFloat(obj['k']);

       return {q2:new Q(w,i,j,k), q1:state['q1'].clone(), q1m:state['q1m'].clone(), q2m:state['q2m'].clone(), op:state['op'], action:Q2_CHANGE};

     // add a quaternion to memory
     case M_ADD:

       if( action.payload == Q1 )
         return {q1m:state['q1'].clone(), q2:state['q2'].clone(), q1:state['q1'].clone(), q2m:state['q2m'].clone(), op:state['op'], action:M_ADD};
       else
         return {q2m:state['q2'].clone(), q2:state['q2'].clone(), q1:state['q1'].clone(), q1m:state['q1m'].clone(), op:state['op'], action:M_ADD};

     // recall quaternion 1 or 2 from memory
     case M_RECALL:
       // differentiate on the basis of the payload and then pass as specific action to subscribers
       if( action.payload == Q1 )
         return {q1:state['q1m'].clone(), q2:state['q2'].clone(), q1m:state['q1m'].clone(), q2m:state['q2m'].clone(), op:state['op'], action:M_RECALL_1};
       else
         return {q1:state['q1'].clone(), q2:state['q2m'].clone(), q1m:state['q1m'].clone(), q2m:state['q2m'].clone(), op:state['op'], action:M_RECALL_2};

     // operation changed - tbd - validate the operation change
     case OP_CHANGE:
       return {q1:state['q1'].clone(), q2:state['q2'].clone(), q1m:state['q1m'].clone(), q2m:state['q2m'].clone(), op:action.payload, action:OP_CHANGE};

     // 'clear' may also be used as an initialization state for the model
     case CLEAR:
       return {q1:new Q(0,0,0,0), q2:new Q(0,0,0,0), q1m:new Q(0,0,0,0), q2m:new Q(0,0,0,0), op:state['op'], action:CLEAR};

     // any unrecognized action clears the calculator
     default:
       return {q1:new Q(0,0,0,0), q2:new Q(0,0,0,0), q1m:new Q(0,0,0,0), q2m:new Q(0,0,0,0), op:state['op'], action:NONE};
   }
}