'use strict';

module.exports = function($rootScope){
        var REGEX;
        return{
            REGEX: {
                dateTime: "/(?:\\d{4})([-\\/\\.])\\d{1,2}\\1\\d{1,2}(\\s)\\d{1,2}([\\:\\.])(00|30)$/" ,
                location: "/\\w{5,50}$/"

            }
        }
        console.log("init util");

    };
