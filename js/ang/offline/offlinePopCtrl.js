'use strict';

module.exports = function($scope, PopService){
       $scope.popLabel = PopService.popData;
    $scope.sendEvent = function(){
        console.log("click popController");
        PopService.eventService($scope.popLabel);
    }


}
