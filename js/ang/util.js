/**
 * Created with JetBrains WebStorm.
 * User: Mide
 * Date: 9/25/14
 * Time: 5:02 PM
 * To change this template use File | Settings | File Templates.
 */

var util = angular.module('util',[]);

util.service('utilS', function($rootScope){
        var REGEX;
        return{
            REGEX: {
                dateTime: "/(?:\\d{4})([-\\/\\.])\\d{1,2}\\1\\d{1,2}(\\s)\\d{1,2}([\\:\\.])(00|30)$/" ,
                location: "/\\w{5,50}$/"

            }
        }
        console.log("init util");

    });
