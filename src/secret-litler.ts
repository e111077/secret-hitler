import { LitElement, html, property } from '@polymer/lit-element';
import { installRouter, setPath } from './router.js';
import { GameStatus } from './game.js';
import './secret-litler-landing.js';
import { SecretLitlerLanding } from './secret-litler-landing.js';

interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  databaseURL?: string;
  projectId: string;
}

enum ClientStatus {
  LOADING,
  LANDING,
  LOBBY,
}

const JSON_CONFIG_PATH = '../assets/firebaseconfig.json';
class SecretLitler extends LitElement {
  @property({type: Object})
  private clientStatus: ClientStatus;
  private db?: firebase.firestore.Firestore;
  private gameId?: string;
  private firebaseReady: Promise<void>;

  constructor() {
    super();
    this.clientStatus = ClientStatus.LOADING;
    this.firebaseReady = this.initFirebase().catch(() => {
      throw new Error('Issue in configuring firebase');
    });
    installRouter(this.route.bind(this));
  }

  render() {
    switch (this.clientStatus) {
      case ClientStatus.LOADING:
        return html`
          <div>Loading Files...</div>`;
      case ClientStatus.LANDING:
        return html`
          <secret-litler-landing
              id="landing"
              .db="${this.db}"
              @gameInitialized="${() => { this.onGameInitialized(); } }">
          </secret-litler-landing>`;
      case ClientStatus.LOBBY:
        return html`
          <div>Join the game at ${`${window.location.origin} with Game ID: ${this.gameId}`}</div>`;
      default:
        return html`<div>Game Status Error</div>`;
    }
  }

  private onGameInitialized() {
    const landing = this.shadowRoot!.getElementById('landing') as SecretLitlerLanding | null;
    if (!landing) {
      throw Error('Landing element could not be found');
    }

    const gameReference = landing.gameReference;
    const gameId = landing.gameId;

    if (gameReference && gameId) {
      gameReference.set({status: GameStatus.LOBBY}, {merge: true}).then(() => {
        setPath(`/lobby/${gameId}`, {}, `Secret litler - lobby ${gameId}`);
      }).catch(() => {
        throw new Error('Cannot set Lobby on ' + gameReference.id);
      });
    }
  }

  async initFirebase() {
    const res = await fetch(JSON_CONFIG_PATH);
    const config: FirebaseConfig = await res.json();
    firebase.initializeApp(config);
    this.db = firebase.firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  private async route(location: Location) {
    const pathParts = this.splitLocation(location);

    switch (pathParts[0]) {
      case '':
        await this.firebaseReady;
        this.clientStatus = ClientStatus.LANDING;
        break;
      case 'lobby':
        await this.firebaseReady;
        this.gameId = pathParts[1];
        this.clientStatus = ClientStatus.LOBBY;
        break;
    }
  }

  private splitLocation(location: Location) {
    const pathParts = location.pathname.split('/');
    pathParts.splice(0, 1);
    return pathParts;
  }
}

customElements.define('secret-litler', SecretLitler);