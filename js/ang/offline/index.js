'use strict';
module.exports = angular.module('offlineModule',['util'])
.controller('offlineCtrl', require('./autocalOfflineCtrl.js'))
.directive('addEventPopOfflineDirective', require('./addEventPopOfflineDirecive.js'))
.factory('popServiceOffline', require('./popServiceOffline.js'));
