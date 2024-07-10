import { ori } from '../game/mod.js';


export const handler = {
	
	GET ( req, ctx ) {

		if ( req.headers.get( 'upgrade' )?.toLowerCase() == 'websocket' ) {
		
			const { socket, response } = Deno.upgradeWebSocket( req );

			ori.connect( socket );

			return response;

		}

		return ctx.render();

	},

};

export default function Socket () {

	return <div>Сюда подключаться по сокету</div>

}
