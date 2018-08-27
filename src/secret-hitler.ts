import { LitElement, html, property } from '@polymer/lit-element';
import { installRouter, setPath } from './router.js';
import { GameStatus } from './game.js';
import './secret-hitler-landing.js';
import { SecretHitlerLanding } from './secret-hitler-landing.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  databaseURL?: string;
  projectId: string;
}

const JSON_CONFIG_PATH = '../assets/firebaseconfig.json';
class SecretHitler extends LitElement {
  @property({type: Object})
  private gameStatus: GameStatus;
  private db?: firebase.firestore.Firestore;
  private gameId?: string;

  constructor() {
    super();
    this.gameStatus = GameStatus.CREATED;
    installRouter(this.route.bind(this));
    this.initFirebase().catch(() => {
      throw new Error('Issue in configuring firebase');
    });
  }

  render() {
    switch (this.gameStatus) {
      case GameStatus.CREATED:
        return html`
          <div>Loading Files...</div>`;
      case GameStatus.LANDING:
        return html`
          <secret-hitler-landing
              id="landing"
              .db="${this.db}"
              .status="${this.gameStatus}"
              @gameInitialized="${() => { this.onGameInitialized(); } }">
          </secret-hitler-landing>`;
      case GameStatus.LOBBY:
        return html`
          <div>Join the game at ${`${window.location.origin}/join/${this.gameId}`}</div>`;
      default:
        return html`<div>Game Status Error</div>`;
    }
  }

  private onGameInitialized() {
    const landing = this.shadowRoot!.getElementById('landing') as SecretHitlerLanding | null;
    if (!landing) {
      throw Error('Landing element could not be found');
    }

    const gameReference = landing.gameReference;
    const gameId = landing.gameId;

    if (gameReference && gameId) {
      gameReference.set({status: GameStatus.LOBBY}, {merge: true}).then(() => {
        setPath(`/lobby/${gameId}`, {}, `Secret hitler - lobby ${gameId}`);
        this.gameStatus = GameStatus.LOBBY;
      }).catch(() => {
        throw new Error('Cannot set Lobby on ' + gameReference.id);
      });
    }
  }

  async initFirebase() {
      const res = await fetch(JSON_CONFIG_PATH);
      const config: FirebaseConfig = await res.json();
      console.log(config);
      firebase.initializeApp(config);
      this.db = firebase.firestore();
      this.db.settings({ timestampsInSnapshots: true });
      this.gameStatus = GameStatus.LANDING;
  }

  private route(location: Location, event: Event) {
    console.log(location, event);
    const pathParts = this.splitLocation(location);

    switch (pathParts[0]) {
      case 'lobby':
        this.gameId = pathParts[1];
        break;
      case 'join':
        this.gameId = pathParts[1];
        this.gameStatus = GameStatus.JOIN;
    }
  }

  private splitLocation(location: Location) {
    const pathParts = location.pathname.split('/');
    pathParts.splice(0, 1);
    return pathParts;
  }
}

customElements.define('secret-hitler', SecretHitler);