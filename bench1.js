import { encode, decode } from 'jsr:@std/msgpack';
import { deflateSync, inflateSync } from 'npm:fflate';
import { encode as encode2, decode as decode2 } from "npm:@msgpack/msgpack";
import msgpacklite from "npm:msgpack-lite";


let json = Deno.readTextFileSync( './json1.json' )
let obj;

let msg;
let obj2;

let def;
let inf;

Deno.bench( 'json parse', 			() => obj = JSON.parse( json ) )
Deno.bench( 'json stringify', 		() => json = JSON.stringify( obj ) )

Deno.bench( 'Deno-msgpack encode', 	() => msg = encode( obj ) )
Deno.bench( 'Deno-msgpack decode', 	() => obj2 = decode( msg ) )

Deno.bench( 'E262-msgpack encode', 	() => msg = encode2( obj ) )
Deno.bench( 'E262-msgpack decode', 	() => obj2 = decode2( msg ) )

// Deno.bench( 'lite-msgpack encode', 	() => msg = msgpacklite.encode( obj ) )
// Deno.bench( 'lite-msgpack decode', 	() => obj2 = msgpacklite.decode( msg ) )

Deno.bench( 'deflate', 				() => def = deflateSync( obj2 ) )
Deno.bench( 'inflate', 				() => inf = inflateSync( def ) )


console.log( json.length )
console.log( encode2( JSON.parse( json ) ).length )

console.log( deflateSync( new TextEncoder().encode( json ) ).length )
console.log( deflateSync( encode2( JSON.parse( json ) ) ).length )