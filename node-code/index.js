const satellite = require('satellite.js');

const tle1 = '1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999';
const tle2 = '2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009'

const satrec = satellite.twoline2satrec(tle1, tle2);

const positionAndVelocity = satellite.propagate(satrec, new Date())

console.log(positionAndVelocity)