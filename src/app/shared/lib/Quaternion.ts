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
 * Typescript Math Toolkit: Methods for defining and operating with Quaternions.  This is one of the few 'coordinate' classes that considers three-dimensional coordinates so that the class
 * may be used in games where simple (drawn) objects are manipulated with 3D transforms.
 * 
 * Note that the presumed Quaternion form is q[0] + q[1]i + q[2]j + q[3]k or (real, img).
 * 
 * A unit Quaternion is defined on initialization.
 * 
 * @author Jim Armstrong (www.algorithmist.net)
 * 
 * @version 1.0
 */

 export class TSMT$Quaternion
 {
   private PI_2: number;       // PI / 2
   private _q: Array<number>;  // internal representation of quaternion (4-tuple of w, i, j, k)

   constructor()
   {
     this.PI_2 = 0.5*Math.PI
     this._q   = [1, 0, 0, 0];
   }
    
  /**
   * Access the Quaternion values
   * 
   * @return Array - A four-element array containing a copy of the Quaternion values
   */
   public get values(): Array<number>
   {
     return this._q.slice();
   }
    
  /**
   * Create a new Quaternion from an array of numbers
   * 
   * @param values : Array - w, i, j, and k values - length must be at least 3 in which case the real value is set to 1
   * 
   * @return Nothing 
   */
   public fromArray(values: Array<number>): void
   {
     if( !values || values.length < 3 )
       return;
        
     if( values.length == 3 )
     {
       this._q[1] = values[0];
       this._q[2] = values[1];
       this._q[3] = values[2];
        
       this._q[0] = 1.0;
     }
     else
     {
       this._q[0] = values[0];
       this._q[1] = values[1];
       this._q[2] = values[2];
       this._q[3] = values[3];
     }
   }

  /**
   * Create a new Quaternion from an Object
   * 
   * @param q : Object - Object with 'w', 'i', 'j', and 'k' properties
   * 
   * @return Nothing - Object properties are copied 
   */
   public fromObject(q:Object): void
   {
     // remember that JS loves to coerce Object values to strings
     if( q.hasOwnProperty('w') )
       this._q[0] = isNaN(q['w']) ? this._q[0] : parseFloat(q['w']);

     if( q.hasOwnProperty('i') )
       this._q[1] = isNaN(q['i']) ? this._q[1] : parseFloat(q['i']);

     if( q.hasOwnProperty('j') )
       this._q[2] = isNaN(q['j']) ? this._q[2] : parseFloat(q['j']);

     if( q.hasOwnProperty('k') )
       this._q[3] = isNaN(q['k']) ? this._q[3] : parseFloat(q['k']);
   }

  /**
   * Return an Object representation of this quaternion
   *
   * @return Object - Object with 'w', 'i', 'j', and 'k' properties that represent the current quaternion values
   */
   public toObject(): Object
   {
     return {w:this._q[0], i:this._q[1], j:this._q[2], k:this._q[3]};
   }
      
  /**
   * Create a Quaternion that has the specified x-axis rotation
   * 
   * @param angle : Number - x-axis rotation value in radians
   * 
   * @return Nothing - The current Quaternion has the specified x-axis rotation (or no rotation for invalid input)
   */
   public fromXRotation(angle:number): void
   {
     var a      = isNaN(angle) ? 0.0 : 0.5*angle;
     this._q[0] = Math.sin(a);
     this._q[1] = 0;
     this._q[2] = 0;
     this._q[3] = Math.cos(a);
   }
      
  /**
   * Create a Quaternion that has the specified y-axis rotation
   * 
   * @param angle : Number - y-axis rotation value in radians
   * 
   * @return Nothing - The current Quaternion has the specified y-axis rotation (or no rotation for invalid input)
   */
   public fromYRotation(angle: number): void
   {
     var a      = isNaN(angle) ? 0.0 : 0.5*angle;
     this._q[0] = 0;
     this._q[1] = Math.sin(a);
     this._q[2] = 0;
     this._q[3] = Math.cos(a);
   }
      
  /**
   * Create a Quaternion that has the specified z-axis rotation
   * 
   * @param angle : Number - z-axis rotation value in radians
   * 
   * @return Nothing - The current Quaternion has the specified z-axis rotation (or no rotation for invalid input)
   */
   public fromZRotation(angle: number): void
   {
     var a      = isNaN(angle) ? 0.0 : 0.5*angle;
     this._q[0] = 0;
     this._q[1] = 0;
     this._q[2] = Math.sin(a);
     this._q[3] = Math.cos(a);
   }
      
  /**
   * Create a Quaternion that has the specified rotation about the specified axis
   * 
   * @param axis : Vector - 3D vector from origin to point in 3-space that defines a rotation axis
   * 
   * @param angle : Number - Rotation angle in degrees
   * 
   * @return Nothing - The current Quaternion has the specified rotation about the specified axis; there is no error-checking for performance - the method 
   * returns 'something' even if inputs are partially invalid.
   */
   public fromAxisRotation(axis:Array<number>, angle:number): void
   {
     var l:number = axis.length == 3 ? Math.sqrt( axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2] ) : 0.0;
     var d:number = Math.abs(l) < 0.0000000001 ? 100000 : 1/l;

     var a:number = 0.5*angle;
     var c:number = Math.cos(a);
     var s:number = Math.sin(a)*d;
        
     this._q[0] = c;
     this._q[1] = s*axis[0];
     this._q[2] = s*axis[1]; 
     this._q[3] = s*axis[2];
   }
      
  /**
   * Compute the current Quaternion that is equivalent to the supplied 3x3 rotation matrix
   * 
   * @param m : Array - Array of arrays that contains a 3x3 rotation matrix
   * 
   * @return Nothing
   */
   public fromRotationMatrix(m: Array< Array<number> >): void
   {
     if (m.length != 3)
       return;

     // TODO - check trace of rotation matrix
     var u: number;
     var v: number;
     var w: number;

     // u, v, and w are chosen so that u is the index of max. diagonal of m.  u v w are an even permutation of 0, 1, 2.
     if( m[0][0] > m[1][1] && m[0][0] > m[2][2] ) 
     {
       u = 0;
       v = 1;
       w = 2;
     } 
     else if( m[1][1] > m[0][0] && m[1][1] > m[2][2] ) 
     {
       u = 1;
       v = 2;
       w = 0;
     } 
     else 
     {
       u = 2;
       v = 0;
       w = 1;
     }

     var r      = Math.sqrt(1 + m[u][u] - m[v][v] - m[w][w]);
     this._q[u] = 0.5*r;
        
     r          = 0.5/r;
     this._q[v] = r*(m[v][u] + m[u][v]);
     this._q[w] = r*(m[u][w] + m[w][u]);
     this._q[3] = r*(m[v][w] - m[w][v]);
   }

  /**
   * Computes a 3-by-3 rotation matrix from the current Quaternion
   * 
   * @return Array - An array of arrays that represents a 3x3 Euler rotation matrix from the current Quaternion values
   */
   public toRotationMatrix(): Array< Array<number> > 
   {
     var qW: number = this._q[0];
     var qX: number = this._q[1];
     var qY: number = this._q[2];
     var qZ: number = this._q[3];

     var qWqW: number = qW*qW;
     var qWqX: number = qW*qX;
     var qWqY: number = qW*qY;
     var qWqZ: number = qW*qZ;
     var qXqW: number = qX*qW;
     var qXqX: number = qX*qX;
     var qXqY: number = qX*qY;
     var qXqZ: number = qX*qZ;
     var qYqW: number = qY*qW;
     var qYqX: number = qY*qX;
     var qYqY: number = qY*qY;
     var qYqZ: number = qY*qZ;
     var qZqW: number = qZ*qW;
     var qZqX: number = qZ*qX;
     var qZqY: number = qZ*qY;
     var qZqZ: number = qZ*qZ;

     var r: Array< Array<number> > = new Array< Array<number> >();

     var d: number = qWqW + qXqX + qYqY + qZqZ;

     if( Math.abs(d) > 0.0000000001 )
     {
       d      = 1/d;
       var d2 = d+d;
          
       r.push( [ d*(qWqW + qXqX - qYqY - qZqZ), d2*(qWqZ + qXqY), d2*(qXqZ - qWqY)] );
       r.push( [ d2*(qXqY - qWqZ), d*(qWqW - qXqX + qYqY - qZqZ), d2*(qWqX + qYqZ)] );
       r.push( [ d2*(qWqY + qXqZ), d2*(qYqZ - qWqX), d*(qWqW - qXqX - qYqY + qZqZ)] );
     }
        
     return r;
   }

  /**
   * Clone the current Quaternion
   * 
   * @return Quaternion - Clone of the current Quaternion
   */
   public clone(): TSMT$Quaternion
   {
      var q: TSMT$Quaternion = new TSMT$Quaternion();
      q.fromArray(this.values);

      return q;
   }
      
  /**
   * Compute the length of the current Quaternion, 
   * 
   * @return Number - Length of the current Quaternion.
   */
   public length(): number
   {
      return Math.sqrt( this._q[0]*this._q[0] + this._q[1]*this._q[1] + this._q[2]*this._q[2] + this._q[3]*this._q[3] );
   }
      
  /**
   * Normalize the current Quaternion
   * 
   * @return Nothing - The current Quaternion points in the same direction and is of unit length
   */
   public normalize(): void 
   {
     var l:number = this.length();
     var d:number = Math.abs(l) < 0.0000000001 ? 1.0 : 1.0 / l;
        
     this._q[0] *= d; 
     this._q[1] *= d; 
     this._q[2] *= d; 
     this._q[3] *= d; 
   }
      
  /**
   * Add a Quaternion to the current Quaternion and overwrite the current Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Nothing - The current Quaternion, s, is overwritten by s + q.
   */
   public add(q: TSMT$Quaternion): void
   {
     var t: Array<number> = q.values;
        
     this._q[0] += t[0];
     this._q[1] += t[1];
     this._q[2] += t[2];
     this._q[3] += t[3];
   }
      
  /**
   * Add a Quaternion to the current Quaternion and return the result in a new Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Quaternion.  The current Quaternion, s, is added to q and the result returned in a new Quaternion.
   */
   public addTo(q: TSMT$Quaternion): TSMT$Quaternion
   {
     var t:Array<number>   = q.values;
     var s:TSMT$Quaternion = this.clone();
         
     s.add(q);
         
     return s;
   }
       
  /**
   * Add a scalar to the current Quaternion and overwrite the current Quaternion
   * 
   * @param a : Number - Scalar value
   * 
   * @return Nothing:  The current Quaternion, q, is overwritten by q + a
   */
   public addScalar(a:number): void
   {
     this._q[0] += a;
   }
       
  /**
   * Add a scalar to the current Quaternion and return the result in a new Quaternion
   * 
   * @param a : Number - Scalar value
   * 
   * @return Quaternion -  q + a, where q is the current Quaternion
   */
   public addScalarTo(a:number): TSMT$Quaternion
   {
     var s: TSMT$Quaternion = this.clone();
     s.addScalar(a);
         
     return s;
   }

  /**
   * Subtract a Quaternion from the current Quaternion and overwrite the current Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Nothing - The current Quaternion, s, is ovewritten by s - q
   */
   public subtract(q:TSMT$Quaternion)
   {
     var t:Array<number> = q.values;
         
     this._q[0] -= t[0];
     this._q[1] -= t[1];
     this._q[2] -= t[2];
     this._q[3] -= t[3];
   }
       
  /**
   * Subtract a Quaternion from the current Quaternion and return the result in a new Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Quaternion - s - q, where s is the current Quaternion
   */
   public subtractFrom(q:TSMT$Quaternion): TSMT$Quaternion
   {
     var s: TSMT$Quaternion = this.clone();
     s.subtract(q);
          
     return s;
   }

  /**
   * Subtract a scalar from the current Quaternion and overwrite the current Quaternion with the result
   * 
   * @param a : Number
   * 
   * @return Nothing - The current Quaternion, q, is overwritten by q - a
   */
   public subtractScalar(a:number): void
   {
     this._q[0] -= a;
   }
       
  /**
   * Subtract a scalar from the current Quaternion and return the result in a new Quaternion
   * 
   * @param a : Number
   * 
   * @return Quaternion - q - a, where q is the current Quaternion
   */
   public subractScalarFrom(a:number): TSMT$Quaternion
   {
     var s:TSMT$Quaternion = this.clone();
     s.subtractScalar(a);
         
     return s;
   }
       
  /**
   * Multiply the current Quaternion by another Quaternion and overwrite the current Quaternion with the result
   * 
   * @param q : Quaternion
   * 
   * @return Nothing - The current Quaternion, s, is ovewritten by s*q
   */
   public multiply(q:TSMT$Quaternion): void
   {
     var b:Array<number> = q.values;
         
     // this will make it look closer to a textbook formula
     var aW: number = this._q[0];
     var aX: number = this._q[1];
     var aY: number = this._q[2];
     var aZ: number = this._q[3];
     var bW: number = b[0];
     var bX: number = b[1];
     var bY: number = b[2];
     var bZ: number = b[3];

     this._q[0] = aW*bW - aX*bX - aY*bY - aZ*bZ;
     this._q[1] = aW*bX + aX*bW + aY*bZ - aZ*bY;
     this._q[2] = aW*bY - aX*bZ + aY*bW + aZ*bX;
     this._q[3] = aW*bZ + aX*bY - aY*bX + aZ*bW;
   }
       
  /**
   * Multiply the current Quaternion by another Quaternion and return the result in a new Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Quaternion - s*q, where s is the current Quaternion
   */
   public multiplyInto(q: TSMT$Quaternion): TSMT$Quaternion
   {
     var s: TSMT$Quaternion = this.clone();
     s.multiply(q);
          
     return s;
   }
       
  /**
   * Multiply the current Quaternion by a scalar and overwrite the current Quaternion with the result
   * 
   * @param a : Number
   * 
   * @return Nothing - The current Quaternion, q, is ovewritten by q*a
   */
   public multiplyByScalar(a: number): void 
   {
     this._q[0] *= a;
     this._q[1] *= a;
     this._q[2] *= a;
     this._q[3] *= a;
   }
        
  /**
   * Multiply the current Quaternion by a scalar and return the result in a new Quaternion
   * 
   * @param a : Number
   * 
   * @return Quaternion - q*a, where q is the current Quaternion
   */
   public multiplyByScalarInto(a: number): TSMT$Quaternion
   {
     var s:TSMT$Quaternion = this.clone();
     s.multiplyByScalar(a);
          
     return s;
   }

  /**
   * Divide the current Quaternion by another Quaternion and ovewrite the current Quaternion with the result
   * 
   * @param q : Quaternion
   * 
   * @return Nothing - The current Quaternion, s, is overwritten by s / q
   */
   public divide(q:TSMT$Quaternion): void
   {
     var q1: TSMT$Quaternion = q.clone();
     q1.invert();

     this.multiply(q1);
   }
        
  /**
   * Divide the current Quaternion by another Quaternion and return the result in a new Quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Quaternion - s / q, where s is the current Quaternion
   */
   public divideInto(q: TSMT$Quaternion): TSMT$Quaternion
   {
     var s: TSMT$Quaternion = this.clone();
     s.divide(q);
          
     return s;
   }
        
  /**
   * Divide the current Quaternion by a scalar and overwrite the current Quaternion
   * 
   * @param a : Number - Must be nonzero
   * 
   * @return Nothing - The current Quaternion, q, is overwritten by q / a - Nothing is altered if a is near zero.
   */
   public divideByScalar(a: number): void
   {
     var k: number = Math.abs(a) < 0.0000000001 ? 1.0 : 1/a;
        
     this._q[0] *= k;
     this._q[1] *= k;
     this._q[2] *= k;
     this._q[3] *= k;
   }
        
  /**
   * Divide the current Quaternion by a scalar and return the result in a new Quaternion
   * 
   * @param a : Number - Must be nonzero
   * 
   * @return Quaternion - q / a, where q is the currrent Quaternion or q if a is near zero.
   */
   public divideByScalarInto(a:number): TSMT$Quaternion
   {
     var s: TSMT$Quaternion = this.clone();
     s.divideByScalar(a);
          
     return s;
   }
        
  /**
   * Divide a scalar by the current Quaternion and overwrite the current Quaternion with the result
   * 
   * @param a : Number
   * 
   * @return Nothing - The current Quaternion, q, is overwritten by a / q .
   */
   public divideScalarBy(a: number): void 
   {
     var q0: number = this._q[0];
     var q1: number = this._q[1];
     var q2: number = this._q[2];
     var q3: number = this._q[3];

     var l: number = q0*q0 + q1*q1 + q2*q2 + q3*q3;
     var d: number = Math.abs(l) < 0.0000000001 ? 1 : 1/l;
        
     this._q[0] = -a*q0*d;
     this._q[1] = -a*q1*d;
     this._q[2] = -a*q2*d;
     this._q[3] = a*q3*d;
   }
        
  /**
   * Invert the current Quaternion
   * 
   * @return Nothing - The current Quaternion is overwritten by its inverse
   */
   public invert(): void
   {
     var q0: number = this._q[0];
     var q1: number = this._q[1];
     var q2: number = this._q[2];
     var q3: number = this._q[3];

     var l: number = q0*q0 + q1*q1 + q2*q2 + q3*q3;
     var d: number = Math.abs(l) < 0.0000000001 ? 1 : 1/l;
          
     this._q[0] = -q0*d;
     this._q[1] = -q1*d;
     this._q[2] = -q2*d;
     this._q[3] = q3*d;
   }
        
  /**
   * Invert the current quaterion and return the result in a new Quaternion
   * 
   * @return Quaternion - Inverse of current Quaternion - current Quaternion remains unchanged
   */
   public inverse(): TSMT$Quaternion
   {
     var q: TSMT$Quaternion = this.clone();
     q.invert();

     return q;
   }
      
  /**
   * Compute the dot product with another quaternion
   * 
   * @param q : Quaternion
   * 
   * @return Number - Inner product of s and q where s is the current quaternion
   */
   public dot(q: TSMT$Quaternion): number
   {
     var a: Array<number> = q.values;
        
     return a[0]*this._q[0] + a[1]*this._q[1] + a[2]*this._q[2] + a[3]*this._q[3];
   }
      
  /**
   * Spherical Linear Interpolation between the current Quaternion and an input Quaternion
   * 
   * @param q : Quaternion
   * 
   * @param t : Interpolation parameter in [0,1]
   * 
   * @return Quaternion : Slerp from current Quaternion, qa to input Quaternion, qb.
   */
   public slerp( q: TSMT$Quaternion, _t: number ): TSMT$Quaternion
   {
     var t: number = Math.max(0.0,_t);
     t             = Math.min(t,1.0);
        
     var qt: TSMT$Quaternion = this.clone();
        
     // make it look more like a formula you've seen in a book or online
     var qaw: number = this._q[0];
     var qax: number = this._q[2];
     var qay: number = this._q[2];
     var qaz: number = this._q[3];
        
     var b: Array<number> = q.values;
     var qbw: number      = b[0];
     var qbx: number      = b[1];
     var qby: number      = b[2];
     var qbz: number      = b[3];
        
     // cos of half-angle betwen quaternions
     var ctheta: number = qax*qbx + qay*qby + qaz*qbz + qaw*qaw;
         
     if( Math.abs(ctheta) >= 1.0 )
     {
       qt.fromArray( [qax, qay, qaz, qaw] );
       return qt;
     }
     else if( ctheta < 0 ) 
     {
       // avoid the 'long' route :)
       qbx = -qbx; 
       qby = -qby; 
       qbz = -qbz;
       qbw = -qbw; 
          
       ctheta = -ctheta;
     }
        
     var halfTheta: number    = Math.acos(ctheta);
     var sinHalfTheta: number = Math.sqrt(1.0 - ctheta*ctheta);

     if( Math.abs(sinHalfTheta) < 0.001 )
       qt.fromArray( [ qax*0.5 + qbx*0.5, qay*0.5 + qby*0.5, qaz*0.5 + qbz*0.5, qaw*0.5 + qbw*0.5 ] );
     else
     {
       var rA: number = Math.sin((1.0 - t)*halfTheta) / sinHalfTheta;
       var rB: number = Math.sin(t*halfTheta) / sinHalfTheta; 
          
       qt.fromArray( [ qax*rA + qbx*rB, qay*rA + qby*rB, qaz*rA + qbz*rB, qaw*rA + qbw*rB ] );
     }
        
     return qt;
   }
      
  /**
   * Normalized linear interpolation between the current and an input quaternion
   * 
   * @param q : Quaternion
   * 
   * @param t : Interpolation parameter in [0,1].
   * 
   * @return Quaternation - Normalized, interpolated quaterion at t-parameter; note that NLERP does not perserve constant velocity, but is computationally simpler as
   * well as commutative and torque-minimal.
   */
   public nlerp( q: TSMT$Quaternion, _t: number ): TSMT$Quaternion
   {
     var t: number = Math.max(0.0,_t);
     t             = Math.min(t,1.0);
        
     var qt: TSMT$Quaternion = this.clone();
        
     var t1: number = 1.0 - t;

     if( this.dot(q) < 0.0 )
       t = -t;
        
     qt.multiplyByScalar(t1);
     q.multiplyByScalar(t);
        
     qt.add(q);
     qt.normalize();
        
     return qt;
   }
 }