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
System.register(['@angular/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var core_1;
    var MemoryBarComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MemoryBarComponent = (function () {
                function MemoryBarComponent() {
                    // empty
                }
                MemoryBarComponent.prototype.ngOnInit = function () {
                    // empty
                };
                MemoryBarComponent.prototype.__onMemoryAdd = function () {
                };
                MemoryBarComponent.prototype.__onMemoryRecall = function () {
                };
                __decorate([
                    core_1.Input
                ], MemoryBarComponent.prototype, "barID", void 0);
                MemoryBarComponent = __decorate([
                    core_1.Component({
                        selector: 'app-memory-bar',
                        template: "\n    <div class=\"pull-right\">\n      <button class=\"btn-small btn-info qc-memory-pad-right\" (click)=\"__onMemoryAdd()\">M+</button>\n      <button class=\"btn-small btn-info qc-memory-pad-right\" (click)=\"__onMemoryRecall()\">MR</button>\n    </div>",
                        styleUrls: ['memory-bar.component.css']
                    })
                ], MemoryBarComponent);
                return MemoryBarComponent;
            })();
            exports_1("MemoryBarComponent", MemoryBarComponent);
        }
    }
});
