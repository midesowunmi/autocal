'use strict';
module.exports = angular.module('onlineModule',['util'])
.config(require('./googleLoginProvider.js'))
.controller('onlineCtrl', require('./autocalOnlineCtrl.js');
