/**
 * Created by szabolcs.miskolczy on 3/8/2015.
 */
var blog = blog || {};

blog.constants = {
    resposeState : {
        FAILED : 0,
        SUCCESS : 1
    }
};

blog.baseResponseModel = {
    responseResult :{
        isError: false,
        messages : '',
        result : {}
    }
};

module.exports = blog;