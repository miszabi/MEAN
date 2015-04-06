/**
 * Created by szabolcs.miskolczy on 3/8/2015.
 */
var log = {
    log : function(){
        console.log(arguments);
    },

    error : function(){
        console.error(arguments);
    },

    info : function(){
        console.info(arguments);
    },

    warn : function(){
        console.warn(arguments);
    }
};

module.exports = log;