/**
 * Created by zhigang on 14-7-19.
 */

var idGen = require('./idGenerator');
var i=0;
while ( i++ < 500) {
    var s = idGen.idGenerator.getInstance();
    console.log(s.nextId());
}
