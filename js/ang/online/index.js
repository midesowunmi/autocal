'use strict';
module.exports = angular.module('onlineModule',['Util'])
.config(require('./googleLoginProvider.js))
.controller('onlineCtrl', require('./autocalOnlineCtrl.js');
