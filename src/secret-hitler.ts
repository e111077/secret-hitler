import { LitElement, html } from '@polymer/lit-element';
import { installRouter } from './router.js';
import { GameStatus, Game } from './game.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  databaseURL?: string;
  projectId: string;
}

const JSON_CONFIG_PATH = '../assets/firebaseconfig.json';
class SecretHitler extends LitElement {
  private gameId: string;
  private app?: firebase.app.App;
  private db?: firebase.firestore.Firestore;
  private firebaseInitialized: Promise<boolean>;

  constructor() {
    super();
    this.firebaseInitialized = this.initFirebase();

    this.gameId = '';
    installRouter(this.removeAttribute.bind(this));
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

  async initFirebase() {
    try {
      const res = await fetch(JSON_CONFIG_PATH);
      const config: FirebaseConfig = await res.json();
      console.log(config);
      this.app = firebase.initializeApp(config);
      this.db = firebase.firestore();
      this.db.settings({ timestampsInSnapshots: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  async startGame() {
    const isReady = await this.firebaseInitialized;
    if (isReady && this.app && this.db) {
      const game: Game = {
        status: GameStatus.INITIALIZING
      };
      this.db.collection('games').add(game);
    }
  }

  route(location: Location) {
    console.log(location);
    if (location.pathname.length > 1) {
      this.gameId = location.pathname;
    }
  }
}

customElements.define('secret-hitler', SecretHitler);