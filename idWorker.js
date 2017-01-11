/**
 * Created by zhigang on 14-7-16.
 */

var long = require('bson').Long;
var format = require('util').format;
var idWorker = function (workerId, datacenterId, sequence) {
    if (!(this instanceof idWorker)) return new idWorker();
    var Long1 = long.NEG_ONE;
    this._Twepoch = long.fromNumber(1288834974657);
    this._workerIdBits = 5;
    this._datacenterIdBits = 5;
    this._sequenceBits = 12;

    this._workerIdShift = this._sequenceBits;
    this._datacenterIdShift = this._sequenceBits + this._datacenterIdBits;
    this._timestampLeftShift = this._sequenceBits + this._workerIdBits + this._datacenterIdBits;

    this._maxWorkerId = Long1.xor(Long1.shiftLeft(this._workerIdBits));
    this._maxDataCenterId = Long1.xor(Long1.shiftLeft(this._datacenterIdBits));

    this._sequenceMask = Long1.xor(Long1.shiftLeft(this._sequenceBits))
    this._sequence = long.ZERO;
    this._lastTimestamp = long.NEG_ONE;

    //public properties
    var wid = workerId || 0;
    var did = datacenterId || 0;
    var seq = sequence || 0;

    this._WorkerId = long.fromNumber(wid);
    this._DataCenterId = long.fromNumber(did);
    this._sequence = long.fromNumber(seq);
    if (this._maxWorkerId.lessThan(this._WorkerId) || this._WorkerId.isNegative())
        throw new Error(format("Error: worker Id can't be greater than %s or less than 0", this._maxWorkerId.toString()));
    if (this._maxDataCenterId.lessThan(this._DataCenterId) || this._DataCenterId.isNegative())
        throw new Error(format("Error: datacenter Id can't be greater than %s or less than 0", this._maxDataCenterId.toString()));

}
idWorker.prototype.nextId = function () {
    var self = this;
    var timestamp = long.fromNumber(self.timeGen());

    if (timestamp.lessThan(self._lastTimestamp)) {
        throw new Error(format(
            "Clock moved backwards.  Refusing to generate id for %s milliseconds", self._lastTimestamp.subtract(timestamp).toString()));
    }

    if (self._lastTimestamp.equals(timestamp)) {
        self._sequence = (self._sequence.add(long.ONE)).and(self._sequenceMask);
        if (self._sequence.equals(long.ZERO)) {
            timestamp = self.tilNextMillis(self._lastTimestamp);
        }
    } else {
        self._sequence = long.ZERO;
    }

    self._lastTimestamp = timestamp;
    var id = ((long.fromNumber(timestamp).subtract(self._Twepoch)).shiftLeft(self._timestampLeftShift)).or(
        (self._DataCenterId.shiftLeft(self._datacenterIdShift)).or(
            (self._WorkerId.shiftLeft(self._workerIdShift))).or(self._sequence));

    return id.toString();
};
idWorker.prototype.getSequence = function () {
    return this._sequence.toString();
};
idWorker.prototype.tilNextMillis = function (lastTimestamp) {
    var self = this;
    var timestamp = self.timeGen();
    while (timestamp.lessThanOrEqual(lastTimestamp)) {
        timestamp = self.timeGen();
    }
    return timestamp;
};
idWorker.prototype.timeGen = function () {
    var self = this;
    //var ms = new Date('ms');
    return long.fromNumber(Date.now());
};

module.exports = idWorker;