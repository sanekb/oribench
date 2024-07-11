import { lit, str, num, obj, def, bool } from '@oxi/schema';


export default {

	player: { id: num() },
	delta_mode: {},

	health: { value: num() },
	color: { value: num() },
	controls: {
		KeyW: bool(),
		KeyA: bool(),
		KeyS: bool(),
		KeyD: bool(),
		Space: bool(),
	},
	space: {},

	bullet: {},

	position: { x: num(), y: num(), z: num() },
	velocity: { x: num(), y: num(), z: num() },

	your_id: { value: num() },

	max_lifetime: { value: num() },
	lifetime: { value: num() },
	
};