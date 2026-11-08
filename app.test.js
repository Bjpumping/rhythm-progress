const test=require('node:test');
const assert=require('node:assert/strict');
const {weekSummary,validNumber}=require('./app.js');
test('Monday–Sunday totals exclude adjacent weeks across a year boundary',()=>{
 const sessions=[{date:'2025-12-28',duration:99},{date:'2025-12-29',duration:20},{date:'2026-01-04',duration:30},{date:'2026-01-05',duration:99}];
 assert.deepEqual(weekSummary(sessions,new Date(2026,0,4,12)),{minutes:50,count:2});
});
test('empty journal returns zero totals',()=>assert.deepEqual(weekSummary([]),{minutes:0,count:0}));
test('duration bounds reject fractions and invalid numbers',()=>{for(const n of [0,-1,1.5,NaN,1441])assert.equal(validNumber(n,1,1440),false);assert.equal(validNumber(15,1,1440),true);});
