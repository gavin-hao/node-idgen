/**
 * Created by zhigang on 14-7-19.
 */

var idworker = require('./idWorker');


var idGenerator = (function () {
//    var workerId = 9, datacenterId = 0, sequence = 0;
//    var worker = new idworker(workerId, datacenterId, sequence);

    var _instance;

    function init(w, d, s) {
        this.workerId = w || 0;
        this.datacenterId = d || 0;
        this.sequence = s || 0;
        var worker = new idworker(this.workerId, this.datacenterId, this.sequence);
        this.nextId = function () {
            var id = worker.nextId();
            return id;
        }
    };

    var _static = {
        name: 'idGenerator',
        getInstance: function (w, d, s) {
            if (_instance === undefined)
                _instance = new init(w, d, s);
            return _instance;
        }
    };
    return _static;
})();
exports.idGenerator = idGenerator;

exports.UidGen = (function () {

    var _instance;

    function init() {

        var worker = new idworker(0, 0, 0);
        return {
            nextId: function () {
                var id = worker.nextId();
                return id;
            }
        }
    };
    if (_instance === undefined)
        _instance = new init();

    return _instance;
})();
exports.ImageIdGen = (function () {
    var _instance;

    function init() {

        var worker = new idworker(2, 0, 0);
        return {
            nextId: function () {
                var id = worker.nextId();
                return id;
            }
        }
    };
    if (_instance === undefined)
        _instance = new init();

    return _instance;
})();

