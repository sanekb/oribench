import { encode, decode } from 'jsr:@std/msgpack';

import {
	deflateSync, inflateSync,
	gzipSync, gunzipSync,
	zlibSync, unzlibSync
} from 'npm:fflate';

import { encode as encode262, decode as decode262 } from "npm:@msgpack/msgpack";
import msgpacklite from "npm:msgpack-lite";
import { unpack, pack, Packr, FLOAT32_OPTIONS } from 'npm:msgpackr';


let src = Deno.readTextFileSync( './_delta_100.json' )
let obj = JSON.parse( src );

let json_parse;
let json_stringify;
let msgpackr_encode;
let msgpackr_decode;
let Deno_msgpack_encode;
let Deno_msgpack_decode;
let E262_msgpack_encode;
let E262_msgpack_decode;
let lite_msgpack_encode;
let lite_msgpack_decode;
let deflate;
let inflate;


const packr0 = new Packr({})
const packr1 = new Packr({ useFloat32: FLOAT32_OPTIONS.ALWAYS })
const packr2 = new Packr({ useFloat32: FLOAT32_OPTIONS.ALWAYS, sequential: true })
const packr3 = new Packr({ useFloat32: FLOAT32_OPTIONS.ALWAYS, sequential: true, useRecords: true })

// Deno.bench( 'json_stringify', 		() => json_stringify = JSON.stringify( obj ) )
// Deno.bench( 'json_parse', 			() => json_parse = JSON.parse( src ) )

// Deno.bench( 'E262_msgpack_encode', 	() => E262_msgpack_encode = encode262( json_parse ) )
// Deno.bench( 'E262_msgpack_decode', 	() => E262_msgpack_decode = decode262( E262_msgpack_encode ) )

// Deno.bench( 'msgpackr_encode', 			() => msgpackr_encode = packr0.encode( obj ) )
// Deno.bench( 'msgpackr_decode', 			() => msgpackr_decode = packr0.decode( msgpackr_encode ) )

// Deno.bench( 'msgpackr_encode f32', 		() => msgpackr_encode = packr1.encode( obj ) )
// Deno.bench( 'msgpackr_decode f32', 		() => msgpackr_decode = packr1.decode( msgpackr_encode ) )

Deno.bench( 'msgpackr_encode f32 s', 	() => msgpackr_encode = packr2.encode( obj ) )
Deno.bench( 'msgpackr_decode f32 s', 	() => msgpackr_decode = packr2.decode( msgpackr_encode ) )

// Deno.bench( 'msgpackr_encode f32 sr', 	() => msgpackr_encode = packr3.encode( obj ) )
// Deno.bench( 'msgpackr_decode f32 sr', 	() => msgpackr_decode = packr3.decode( msgpackr_encode ) )

// Deno.bench( 'lite_msgpack_encode', 	() => lite_msgpack_encode = msgpacklite.encode( json_parse ) )
// Deno.bench( 'lite_msgpack_decode', 	() => lite_msgpack_decode = msgpacklite.decode( lite_msgpack_encode ) )

// Deno.bench( 'Deno_msgpack_encode', 	() => Deno_msgpack_encode = encode( json_parse ) )
// Deno.bench( 'Deno_msgpack_decode', 	() => Deno_msgpack_decode = decode( Deno_msgpack_encode ) )

// Deno.bench( 'deflate', 				() => deflate = deflateSync( msgpackr_encode ) )
// Deno.bench( 'inflate', 				() => inflate = inflateSync( deflate ) )

// Deno.bench( 'gzip', 				() => deflate = gzipSync( msgpackr_encode ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 2', 				() => deflate = gzipSync( msgpackr_encode, { level: 2 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 4', 				() => deflate = gzipSync( msgpackr_encode, { level: 4 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 6', 				() => deflate = gzipSync( msgpackr_encode, { level: 6 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 7', 				() => deflate = gzipSync( msgpackr_encode, { level: 7 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 8', 				() => deflate = gzipSync( msgpackr_encode, { level: 8 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )

Deno.bench( 'gzip 9', 				() => deflate = gzipSync( msgpackr_encode, { level: 9 } ) )
// Deno.bench( 'gunzip', 				() => inflate = gunzipSync( deflate ) )


// console.log( 'src', src.length, ' -> ', deflateSync( new TextEncoder().encode( src ) ).length )
// console.log( '262', encode262( JSON.parse( src ) ).length, ' -> ', deflateSync( encode262( JSON.parse( src ) ) ).length )
// console.log( 'msgr', pack( obj ).length, ' -> ', deflateSync( pack( obj ) ).length )
// console.log( 'msgr32', packr.encode( obj ).length, ' -> ', deflateSync( packr.encode( obj ) ).length )

// console.log( 'msgr', packr0.encode( obj ).length, ' -> ', deflateSync( packr0.encode( obj ) ).length )
// console.log( 'msgr32', packr1.encode( obj ).length, ' -> ', deflateSync( packr1.encode( obj ) ).length )
// console.log( 'msgr32 s', packr2.encode( obj ).length, ' -> ', deflateSync( packr2.encode( obj ) ).length )
// console.log( 'msgr32 sr', packr3.encode( obj ).length, ' -> ', deflateSync( packr3.encode( obj ) ).length )


// const obj1 = packr2.encode( structuredClone(obj) )

// console.log( 'defl', packr2.encode( obj ).length, ' -> ', deflateSync( packr2.encode( obj ) ).length )
// console.log( 'gzip', packr2.encode( obj ).length, ' -> ', gzipSync( packr2.encode( obj ) ).length )
// console.log( 'zlib', packr2.encode( obj ).length, ' -> ', zlibSync( packr2.encode( obj ) ).length )


// const obj2 = packr2.encode( structuredClone(obj) )

// console.log( obj1.length, obj2.length )