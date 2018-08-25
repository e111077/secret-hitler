import { LitElement, html } from '@polymer/lit-element';
import { installRouter } from './router';
// import { firebase } from '@firebase/app';
// import { FirebaseApp } from '@firebase/app-types';

class SecretHitler extends LitElement {
  gameId: string;
  // app: FirebaseApp;
  constructor() {
    super();
    // const config = fetch('firebase_key.json').then((response) => {
    //   console.log(response);
    // });
    // this.app = firebase.initializeApp(config);
    this.gameId = '';
    installRouter((location) => {
      console.log(location);
      if (location.pathname.length > 1) {
        this.gameId = location.pathname;
      }
    });
  }

  render() {
    if (this.gameId) {
      return html`Join game at ${window.location}`;
    }
    return html`
      <div>Secret Hilter</div>
      <button @click="${() => this.startGame()}">Start a new game</button>
    `;
  }

  startGame() {
    // Generate an actually random game id here.
    window.location.replace('/testgameid');
    console.log('do some stuff ehre');
  }
}

customElements.define('secret-hitler', SecretHitler);