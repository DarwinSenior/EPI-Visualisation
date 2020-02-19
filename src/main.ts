import './tailwind.css'
import App from './app.svelte'
import { WEBGL } from 'three/examples/jsm/WebGL.js';
if ( WEBGL.isWebGL2Available() === false ) {
	document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

const app = new App({
  target: document.body
})

export default app
