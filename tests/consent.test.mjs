import test from 'node:test';
import assert from 'node:assert/strict';
import { makeChoice, validChoice, readChoice, mayMeasureAudience } from '../src/privacy/consent.js';
const now = new Date('2026-09-25T12:00:00Z').getTime();
test('audience consent is explicit and refusal stays disabled',()=>{
 const accept=makeChoice('accept',true,now), reject=makeChoice('reject',false,now), custom=makeChoice('custom',true,now);
 assert.equal(accept.audience,true); assert.equal(custom.audience,true); assert.equal(reject.audience,false);
 assert.equal(mayMeasureAudience(accept,now),true); assert.equal(mayMeasureAudience(custom,now),true); assert.equal(mayMeasureAudience(reject,now),false);
});
test('same six-month lifetime for acceptance and refusal; expired decisions rejected',()=>{
 const accept=makeChoice('accept',false,now), reject=makeChoice('reject',false,now);
 assert.equal(accept.expiresAt,reject.expiresAt);
 assert.equal(new Date(accept.expiresAt).toISOString(),'2027-03-25T12:00:00.000Z');
 assert.equal(validChoice(accept,accept.expiresAt),false);
});
test('policy changes, tampered dates and malformed storage fail closed',()=>{
 const value=makeChoice('accept',false,now);
 for(const bad of [null,{}, {...value,version:'old'}, {...value,savedAt:now+1}, {...value,expiresAt:Infinity}, {...value,expiresAt:value.expiresAt+1}]) assert.equal(validChoice(bad,now),false);
 assert.equal(readChoice({getItem:()=>'{broken'},now),null);
 assert.equal(readChoice({getItem:()=>{throw Error('blocked')}},now),null);
 assert.deepEqual(readChoice({getItem:()=>JSON.stringify(value)},now),value);
});
