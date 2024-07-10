import { faker } from 'npm:@faker-js/faker';
import { Ori } from '@ori/core';
import schemas from './schemas.js';
import * as THREE from 'npm:three';
import randomColor from 'npm:randomcolor';


const ori = new Ori();
const { Cluster, Space, Entity, $, $$, $$d } = ori;


const MAX_ENTITIES = 10;
const TPS = 10;
const MSPT = 1000 / TPS;

ori.use( schemas )

$$( 'DefaultSpace', new Space( {

	open ( ctx ) {

		const { entity } = ctx;

		const radiusP = Math.random()*10+10;
		const angleP = Math.random()*Math.PI*2;

		const pid = Math.random()

		entity
			.add( { vid: 'player', id: pid } )
			.add( { vid: 'health', value: 100 } )
			.add( { vid: 'color', value: randomColor() } )
			.add( { vid: 'position', x: Math.cos(angleP)*radiusP, y: 0, z: Math.sin(angleP)*radiusP } )
			.add( { vid: 'velocity', x: 0, y: 0, z: 0 } )

		ctx.client.send( { vid: 'your_id', value: pid } );

	},

	close ( ctx ) {

		const { client, entity } = ctx;

		$$d( client );
		$( 'DefaultCluster' ).delete( entity );

	},

	controls ( ctx ) {

		ctx.entity.add( ctx.valid );

	},

}));

$$( 'DefaultCluster', new Cluster()

	// .use( function spawner () {

	// 	const total = this.where( { vid: 'color' } ).length;

	// 	const red = new THREE.Color( 0xff0000 );
	// 	const green = new THREE.Color( 0x00ff00 );

	// 	for ( let i = total; i < MAX_ENTITIES; i++ ) {

	// 		const radiusP = Math.random()*0+5;
	// 		const radiusV = Math.random()*4+1;

	// 		const angleP = Math.random()*Math.PI*2;
	// 		const angleV = Math.random()*Math.PI*2;

	// 		const entity = new Entity(
	// 			{ vid: 'color', value: red.clone().lerp( green, (5-radiusV)/5  ).getHex() },
	// 			{ vid: 'position', x: Math.cos(angleV)*radiusP, y: 0, z: Math.sin(angleV)*radiusP },
	// 			{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV },
	// 			{ vid: 'max_lifetime', value: Math.floor(Math.random()*7+3) },
	// 			{ vid: 'lifetime', value: 0 },
	// 		)

	// 		this.add( entity );

	// 	}

	// })
	.use( function inputer () {

		this.where( { vid: 'controls' } ).forEach( entity => {

			const ctr = entity.get( 'controls' );
			const vel = entity.get( 'velocity' );

			vel.x = -5*ctr.KeyA + 5*ctr.KeyD;
			vel.z = -5*ctr.KeyW + 5*ctr.KeyS;

			if ( ctr.Space ) {

				const radiusP = Math.random()*0+5;
				const radiusV = Math.random()*0+10;

				const angleP = Math.random()*Math.PI*2;
				const angleV = Math.random()*Math.PI*2;

				const bullet = new Entity(
					{ vid: 'bullet' },
					{ vid: 'color', value: '#00ffff' },
					{ vid: 'velocity', x: Math.cos(angleV)*radiusV, y: 0, z: Math.sin(angleV)*radiusV },
					{ vid: 'max_lifetime', value: 5 },
					{ vid: 'lifetime', value: 0 },
					entity.get('position').toObject( false ),
				)

				$( 'DefaultCluster' ).add( bullet );

			}

		})

	})
	.use( function mover ( dt ) {

		this.where( { vid: 'position' } ).forEach( entity => {

			const pos = entity.get( 'position' );
			const vel = entity.get( 'velocity' );

			pos.x += vel.x * dt;
			pos.z += vel.z * dt;

		})

	})
	.use( function liver ( dt ) {

		this.where( { vid: 'lifetime' } ).forEach( entity => {

			entity.get( 'lifetime' ).value += dt;

		})

	})
	.use( function deleter () {

		this.where( { vid: 'health' } ).forEach( entity => {

			const cur = entity.get( 'health' );

			if ( cur.value <= 100 ) {
				// this.delete( entity )
			}

		})

		this.where( { vid: 'lifetime' } ).forEach( entity => {

			const cur = entity.get( 'lifetime' );
			const max = entity.get( 'max_lifetime' );

			if ( cur.value >= max.value ) {
				this.delete( entity )
			}

		})

	})
	.on( 'update', function ( v ) {

		const delta_length = Object.keys( v.last ).length;

		this.where( { vid: 'player' } ).forEach( entity => {

			if ( entity.has( 'delta_mode' ) && ( delta_length != 0 ) ) {
				$( entity ).send( { vid: 'delta', value: v.last } );
			}

			if ( ! entity.has( 'delta_mode' ) ) {
				$( entity ).send( { vid: 'delta', value: v.full } );
				entity.add( { vid: 'delta_mode' } )
			}

		})

	})
	.start( TPS )
)


export { ori }


// setInterval( () => {

// 	console.clear();
// 	console.log( ori.store.toDebug() )

// }, 3e3 )