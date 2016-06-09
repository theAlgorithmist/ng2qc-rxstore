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

 // Possible actions to be taken throughout the quaternion calculator application. 

 export const Q1_CHANGE  = 'Q1';      // quaternion 1 changed
 export const Q2_CHANGE  = 'Q2';      // quaternion 2 changed
 export const OP_CHANGE  = 'OP';      // quaternion 3 changed
 export const M_ADD      = 'MADD';    // add a quaternion to memory
 export const M_RECALL   = 'MREC';    // recall an arbitrary quaternion from memory
 export const M_RECALL_1 = 'MREC1';   // recall quaternion 1 from memory
 export const M_RECALL_2 = 'MREC2';   // recall quaternion 2 from memory
 export const CLEAR      = 'CLEAR';   // clear the calculator
 export const NONE       = 'NONE';    // no action

 // ID's used to map quaternion display to a memory bar
 export const Q1 = "Q_1";
 export const Q2 = "Q_2";

 // allowable operations on the calculator; you could also place memory-add and memory-recall here.
 export enum OpEnum
 {
   NONE,
   ADD,
   SUBTRACT,
   MULTIPLY,
   DIVIDE
 }