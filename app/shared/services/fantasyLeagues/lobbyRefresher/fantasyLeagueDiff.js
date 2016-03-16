/*
* Represents a diff between two fantasy leagues. If property name is undefined then it is assumed that 
* the fantasy league is new and the oldVal will also be undefined.
* 
* flid - The fantasy league id in question
* propertyName - The property name that is different. Or if undefined will be FantasyLeague
* oldVal - The old fantasyleague that has changed
* newVal - The new fantasy league.
*/
var fantasyLeagueDiff = function (flid, propertyName, oldVal, newVal) {
    //'use strict';
    this.flid = flid;
    this.propertyName = (typeof propertyName) !== 'undefined' ? propertyName : 'FantasyLeague';
    this.oldVal = oldVal;
    this.newVal = newVal;
};