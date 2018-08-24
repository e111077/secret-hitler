import { LitElement, html } from '@polymer/lit-element';
import { installRouter } from './router';
import { firebase } from '@firebase/app';

class SecretHitler extends LitElement {
  constructor() {
    super();
    const config = fetch('firebase.json');
    const app = firebase.initializeApp(config);
    console.log(app);
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