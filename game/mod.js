import { faker } from 'npm:@faker-js/faker';
import { Ori } from '@ori/core';
import schemas from './schemas.js';
import * as THREE from 'npm:three';
import randomColor from 'npm:randomcolor';

import { spawner, mover, liver, deleter } from './func.js'




const ori = new Ori();
const { Cluster, Space, Entity, $, $$, $t, $$d } = ori;

ori.use( schemas )


const TPS = 20;



$$( 'DefaultSpace', new Space( {

	open ( ctx ) {

		const { entity } = ctx;

		const radiusP = Math.random()*10+10;
		const angleP = Math.random()*Math.PI*2;

		const pid = Math.random()

		entity
			.add( { vid: 'player', id: pid } )
			.add( { vid: 'health', value: 100 } )
			.add( { vid: 'color', value: parseInt(randomColor().slice(1), 16) } )
			.add( { vid: 'position', x: Math.cos(angleP)*radiusP, y: 0, z: Math.sin(angleP)*radiusP } )
			.add( { vid: 'velocity', x: 0, y: 0, z: 0 } )

		$t( Cluster ).add( entity );

		ctx.client.send( { vid: 'your_id', value: pid } );

	},

	close ( ctx ) {

		const { client, entity } = ctx;

		$$d( client );
		$t( Cluster ).delete( entity );

	},

	// create ( ctx ) {
	// 	console.log("OLO BLAYSDM,")
	// 	createCluster()
	// },

}));

let clusters = 0;

function createCluster () {

	let cid = ++clusters;
	const cluster = new Cluster;

	cluster
		.use( spawner )
		.use( mover )
		.use( liver )
		.use( deleter )
		.on( 'update', function ( v ) {

			tps.set( cid, v.time )

			const delta_length = Object.keys( v.delta ).length;
			
			this.where( { vid: 'player' } ).forEach( entity => {

				if ( entity.has( 'delta_mode' ) && ( delta_length != 0 ) ) {
					$( entity ).send( { vid: 'delta', value: v.delta } );
				}

				if ( ! entity.has( 'delta_mode' ) ) {
					$( entity ).send( { vid: 'snapshot', value: v.snapshot } );
					entity.add( { vid: 'delta_mode' } )
				}

			})

		})
		.start( TPS )

	$$( cid, cluster );

}

const tps = new Map();

for ( let cid = 1; cid <= 1; cid++ ) {

	createCluster()
	
}


export { ori }




// .use( function inputer () {

// 	this.where( { vid: 'controls2' } ).forEach( entity => {

// 		const ctr = entity.get( 'controls2' );
// 		const vel = entity.get( 'velocity' );

// 		const tKeyW = ( ctr.KeyW[1] ?? performance.now() ) - ( ctr.KeyW[0] ?? performance.now() )
// 		const tKeyA = ( ctr.KeyA[1] ?? performance.now() ) - ( ctr.KeyA[0] ?? performance.now() )
// 		const tKeyS = ( ctr.KeyS[1] ?? performance.now() ) - ( ctr.KeyS[0] ?? performance.now() )
// 		const tKeyD = ( ctr.KeyD[1] ?? performance.now() ) - ( ctr.KeyD[0] ?? performance.now() )

// 		vel.x = -25*tKeyA/1e3 + 25*tKeyD/1e3;
// 		vel.z = -25*tKeyW/1e3 + 25*tKeyS/1e3;

	// 		if ( ctr.KeyW[1] == null ) { ctr.KeyW[0] = performance.now(); ctr.KeyW[1] = null; } else { ctr.KeyW[0] = null; ctr.KeyW[1] = null; }
// 		if ( ctr.KeyA[1] == null ) { ctr.KeyA[0] = performance.now(); ctr.KeyA[1] = null; } else { ctr.KeyA[0] = null; ctr.KeyA[1] = null; }
// 		if ( ctr.KeyS[1] == null ) { ctr.KeyS[0] = performance.now(); ctr.KeyS[1] = null; } else { ctr.KeyS[0] = null; ctr.KeyS[1] = null; }
// 		if ( ctr.KeyD[1] == null ) { ctr.KeyD[0] = performance.now(); ctr.KeyD[1] = null; } else { ctr.KeyD[0] = null; ctr.KeyD[1] = null; }

// 		if ( false ) {

// 			const radiusP = Math.random()*0+5;
// 			const radiusV = Math.random()*0+10;

// 			const angleP = Math.random()*Math.PI*2;
// 			const angleV = Math.random()*Math.PI*2;

// 			const bullet = new Entity(
// 				{ vid: 'bullet' },
// 				{ vid: 'color', value: 0x00ffff },
// 				{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV },
// 				{ vid: 'max_lifetime', value: 5 },
// 				{ vid: 'lifetime', value: 0 },
// 				entity.get('position').toObject( false ),
// 			)

// 			$( 'DefaultCluster' ).add( bullet );

// 		}

// 	})

// })



// setInterval( () => {

// 	console.clear();
// 	console.log( clusters )
// 	console.log( tps )

// }, 1e3 )