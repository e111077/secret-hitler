import { LitElement, html } from '@polymer/lit-element';
import { installRouter } from './router';

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
    // Blah send server request to get URL to join and display URL for joining.
  }
}

customElements.define('secret-hitler', SecretHitler);