import { LitElement, html } from '@polymer/lit-element';
import { installRouter } from '../external_libs/pwa-helpers/src/router.js';

class SecretHitler extends LitElement {
  constructor() {
    super();
    installRouter((location) => console.log(location));
  }

  render() {
    return html`
      <div>Secret Hilter</div>
      <button @click="${() => this.startGame()}">Start a new game</button>
    `;
  }

  startGame() {
    console.log('do some stuff ehre');
    // Blah send server request to get URL to join and display that.
  }
}

customElements.define('secret-hitler', SecretHitler);