'use strict';
function Cs142TemplateProcessor(template){
    this.template = template;
    Cs142TemplateProcessor.prototype.fillIn = function (dictionary){
        // returns - template string with any text of the form {{property}} 
        // replaced with the property of dictionary
        // example template - My favorite month is {{month}} but not the day {{day}} or the year {{year}}
        var re = /\{\{[^\}]*\}\}/g;
        var temp = this.template;
        var key = re.exec(temp);
        var replacement;
    
        while (key !== null){    
            replacement = dictionary[key[0].substr(2,key[0].length-4)]; //(from index, length)
            if (typeof key[0] === "undefined"){
                replacement = "";}
            
            temp = temp.substring(0, key.index) +               // (from idx, to idx)
                    replacement +
                    temp.substring(key.index + key[0].length);
            key = re.exec(temp);
        }
        return temp;
    };
    
}
