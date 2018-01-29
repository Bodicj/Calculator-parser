
    function Valid(line) {
        var osk=0;
        var fault=0;
        for (i=0;i<line.length;i++) {
            if (line.charAt(i)=="(") {osk=osk+1;}
            if (line.charAt(i)==")") {osk=osk-1;}
            if (osk<0) {fault=1;}
        }
        if (!(osk==0)) {fault=1;}
        var reg= new RegExp("\\d|\\.");
        for (i=0;i<line.length;i++){
            if ((line.charAt(i).search(reg)==-1)&&(!(line.charAt(i)=="+"|line.charAt(i)=="-"|line.charAt(i)=="*"|line.charAt(i)=="/"|line.charAt(i)=="("|line.charAt(i)==")"))) {fault=1;}
        }
        if ((line.charAt(line.length-1).search(reg)==-1)&&(!(line.charAt(line.length-1)==")"))) {fault=1;}
        return fault;
    }
 function Solve (arg1, arg2, operator) {
        arg1 = parseFloat(arg1);
        arg2 = parseFloat(arg2);
        //console.log('first argument: ' + arg1 + '\nsecond argument: ' + arg2);
        switch(operator) {
            case '+':
                return arg1 + arg2;
            case '-':
                return arg1 - arg2;
            case '/':
                return arg1 / arg2;
            case '*':
                return arg1 * arg2;
            default:
                //console.log('Wrong operand num:' + operator)
        }
    };
 function Prior (operators) {
     if(operators.indexOf('*') !== -1 || operators.indexOf('/') !== -1){
         if( (operators.indexOf('/') > operators.indexOf('*')) && (operators.indexOf('/') !== -1) && (operators.indexOf('*') !== -1) ){
             return operators.indexOf('*');
         } else {
             if (operators.indexOf('/') == -1){
                 return operators.indexOf('*');
             } else {
             return operators.indexOf('/');
             }
         }
     } else {
            return false
     }
 }
 function arithmeticReduction (str) {
     str = str.replace(/(\+\-)|(\-\+)/g, '-');
     str = str.replace(/(\-\-)/g, '+');
     str = str.replace(/^(\+|\*|\/)/g, '');
     document.getElementById('str').value = str;
     return str
}
 function arithmeticRefinement (operators, operands) {
    var i = 0;
         operands.forEach(function(element) {
             var elem = element.replace(/\/|\*/ig, '');
             operands[i] = elem;
             i++;
         });
         i=0;
         operators.forEach(function(element) {
             var elem = element.replace(/\d/ig, '');
             operators[i] = elem;
             i++;
         });
    return operators, operands
}
 function Calculate (str) {

     str = arithmeticReduction(str);
     var operands = str.match(/(^-)\d+\.\d+|\d+\.\d+|\d+|(^-)\d+|([\/\*]((-\d+\.\d+)|(-\d+)))/gi);
     var operators = str.match(/(\d\-)+|\*|\/|(\+)/gi);
     var result;
     if (operands.length == 1){
         result =+ parseFloat(operands[0]);
         //console.log('current result is: ' + result);
         return document.getElementById('result').innerHTML = result.toString()
     } else {

         arithmeticRefinement (operators, operands);
         console.log('str: ' + str + '\noperators: ' + operators + '\noperands: ' + operands);
         var index = Prior(operators);
         while (index !== false) {
             result = +Solve(operands[index], operands[index + 1], operators[index]);
             console.log('operation: ' + operators[index] + '\nresult: ' + result);
             operands.splice(index, 2, result);
             operators.splice(index, 1);
             index = Prior(operators);
         };
         //console.log('operators length is: ' + operators)
         for (var i = 0; i < operators.length; i++) {
             result = +Solve(operands[0], operands[1], operators[i]);
             operands.shift();
             operands.shift();
             operands.unshift(result.toString());
         }
         //console.log('current result is: ' + result);
         return document.getElementById('result').innerHTML = result.toString();

     }
 };
 function ParceValue(str){
     str = str.replace(/\s/g, '');
     document.getElementById('str').value = str;
     if (Valid(str) == 1){
         document.getElementById('alertBox').style.height = 'auto';
         document.getElementById('alertBox').style.visibility = 'visible'
         document.getElementById('alertBox').innerHTML = 'Invalid Expression';
     }
     else{
         document.getElementById('alertBox').style.visibility = 'hidden';
         document.getElementById('alertBox').style.height = 0;
     }
    var k=1;
    do {
        var openquote=str.lastIndexOf("(");
        //console.log(openquote);
        if (openquote<0) {
            k=0;
        } else {
            var closequote=str.indexOf(")",openquote);
            var inside = str.slice(openquote+1,closequote);
            var changed=Calculate(inside);
            str=str.substr(0,openquote)+changed.toString()+str.substr(closequote+1);
        }
    } while (k==1);
    return Calculate(str);
}
document.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        ParceValue(document.getElementById('str').value);
    }
    return false;}