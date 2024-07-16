import { faker } from 'npm:@faker-js/faker';
import { Ori } from '@ori/core';
import schemas from './game/schemas.js';
import * as THREE from 'npm:three';
import randomColor from 'npm:randomcolor';
import { addExtension, Packr, FLOAT32_OPTIONS } from 'msgpackr';
import hashObject from 'npm:hash-object'


const packr = new Packr( { useFloat32: FLOAT32_OPTIONS.NEVER, sequential: false, moreTypes: true } );

const ori = new Ori();
const { Cluster, Space, Entity, Valid, $, $$, $$d } = ori;


const MAX_ENTITIES = 1e3;
const TPS = 1;


ori.use( schemas )

let entity;
let valid;

const red = new THREE.Color( 0xff0000 );
const green = new THREE.Color( 0x00ff00 );

const radiusP = Math.random()*0+5;
const radiusV = Math.random()*4+1;

const angleP = Math.random()*Math.PI*2;
const angleV = Math.random()*Math.PI*2;


let enc;
let dec;

let cluster1 = new Cluster()
let cluster2 = new Cluster()

let e = new Entity(
	{ vid:'bullet' },
	{ vid:'position',x:1,y:2,z:3 },
);

cluster1
	.add( e )
	.use( function () {
		this.delete( this.find({}) )
	})
	.on( 'tick', () => {
		
		const d = cluster1.delta
		
		console.log( d ); return;

		enc = packr.encode( d )
		dec = packr.decode( enc )
		
		cluster2.delta = dec;

		console.log( cluster2 )

	})
	.tick();