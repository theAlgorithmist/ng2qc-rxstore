# Angular 2/Typescript/Angular CLI/@ngrx/store Quaternion Calculator

This example illustrates how to implement a Quaternion Calculator using a Flux-style architecture and the @ngrx/store library.  If you are coming from React, then Flux and Redux are likely to be familiar concepts.  If not, then take some time to read through these references:

* [Redux-style state mangement powered by RxJs]
* [Comprehensive introduction to @ngrx/store]

If Reactive Programming is also a new concept, then this introduction should get you up to speed:

- [Introduction to Reactive Programming]

This demo implements a Quaternion calculator using the Flux pattern and @ngrx/store as a Redux-style model.  Quaternion arithmetic is encapsulated away in an API using the Typescript Math Toolkit (alpha version).  The Angular CLI was used to scaffold and develop the application.

In keeping with the general philosophy of 'store', the application has one 'smart' component.  The main calculator component contains the controller logic for the entire calculator.  A single, global store represents the state of the calculator at any time.

All other components are children of the main calculator component.  Angular 2 provides a natural input/output flow for parent-child components, and it is possible to use either an (output) event emitter or action dispatch to communicate actions from low-level 'dumb' components.  This demo illustrates both approaches so that you may compare side-by-side.  

The calculator consists of three quaternion components (two input and one result), two memory bars (a horizontal area relating to adding/recall from memory) and a clear button, as shown below

![Quaternion Cacluator](https://image-store.slidesharecdn.com/86681aee-98a9-4e80-82fd-c4dde4021f4e-original.jpeg "Quaternion Calculator")

The quaternion component representing inputs and result uses an _EventEmitter_ to stream outputs.  It may be used in any application, calculator or otherwise, that requires a quaternion.  This component is not tied to any concept of a model.  

The memory bar currently consists of two buttons, M+ (add to memory) and MR (recall from memory).  It's easy to see text or other visual indicator(s) being added in the future.  This component expresses user interaction (clicking either button) by dispatching an action to the store.  It can also be integrated into another application, but that application must implement a store.  Both components preserve the Flux-style flow of actions moving 'upward' either to the model or to a parent component and updates from the store flowing 'downward' through subscribers to model updates. 

In addition to showing off early parts of the Typescript Math Toolkit, I hope this demo provides some additional insight into working with @ngrx/store and its integration into projects created with the Angular CLI.


Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular 2: RC1

## Installation

Installation involves all the usual suspects

  - npm, typings, and Angular CLI installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)

## Introduction

The goals of this demo are 

* Add to the body of knowledge on how to create and run Angular 2/Typescript applications
* Illustrate setting up the Angular CLI with third-party code (bootstrap and @ngrx/store)
* Illustrate how to integrate the Typescript Math Toolkit into an application
* Create an excuse for another cup of coffee

I hope that you find something instructive from the code and are interested in improving the demo in some way.

### Version
1.0.0

### Building and Running the demo

Since the application was created with the Anglar CLI, simply use the normal build process.

After installing the demo, execute _ng build_ or _ng build -prod_ followed by _ng serve_ .  Once the server is started, run the calcuator application at localhost:4200 . 

If you are new to the CLI and integration of third-party codes, then study the angular-cli-build.js file.

This demo has been tested in late-model Chrome on a Mac. 


### Contributions

Contributions and coffee are highly encouraged as I believe the best demo is one that allows ample room for improvement. Suggestions are provided in the documentation.

Submit pull requests to theAlgorithmist [at] gmail [dot] com.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <https://www.linkedin.com/in/jimarmstrong>
[Redux-style state mangement powered by RxJs]: <https://github.com/ngrx/store>
[Comprehensive introduction to @ngrx/store]: <https://gist.github.com/btroncone/a6e4347326749f938510>
[Introduction to Reactive Programming]: <https://gist.github.com/staltz/868e7e9bc2a7b8c1f754>
