'use strict';
function cs142MakeMultiFilter(originalArray){
    // Returns - function that can be used to filter the elements of originalArray
    var currentArray = originalArray;
    function arrayFilterer(filterCriteria, callback){
        // filterCriteria - used to screen array elements 
        if (typeof filterCriteria !== 'function'){
            return currentArray;}
        currentArray = currentArray.filter(filterCriteria);

        if (typeof callback === 'function'){
            callback.call(originalArray, currentArray);}
        
        return arrayFilterer;
    }
    return arrayFilterer;
}