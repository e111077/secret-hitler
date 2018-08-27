import { LitElement, html, property } from '@polymer/lit-element';
import { GameStatus, Game } from './game.js';
import { TemplateResult } from 'lit-html';

export class SecretHitlerLanding extends LitElement {
  public db?: firebase.firestore.Firestore;
  public gameId?: string;
  public gameReference?: firebase.firestore.DocumentReference;
  public status?: GameStatus;
  @property({type: String})
  private error?: string;
  @property({type: Boolean})
  private loading: boolean = false;

  render() {
    let content: TemplateResult;

    if (this.error) {
      content = html`
        <div class="error">${this.error}</div>
        <button @click="${() => { this.error = ''; }}">Clear error</button>
      `;
    } else {
      content = html`
      <div>Secret Hilter</div>
      <h1>Join Game</h1>
      <div>Name: <input></div>
      <div>Game ID: <input></div>
      <button>Join!</button>
      <h1>Create Game</h1>
      <button id="button" .disabled="${this.loading}" @click="${() => this.startGame()}">Start a new game</button>`;
    }

    return html`
      <style>
        .error {
          color: red;
        }
      </style>
      ${content}
    `;
  }

  private async startGame() {
    this.loading = true;
    if (this.db && this.status) {
      const game: Game = {
        status: this.status
      };

      const gameRef = await this.db.collection('games').add(game);
      this.gameReference = gameRef;
      const unsub = gameRef.onSnapshot((snapshot) => {
        if (!snapshot || !snapshot.exists) {
          this.error = 'game does not exist.';
          return;
        } else {
          const gameId = (snapshot.data() as Game).gameId;

          if (gameId) {
            this.gameId = gameId;
            unsub();
            const gameInitializedEvent = new CustomEvent('gameInitialized');
            this.dispatchEvent(gameInitializedEvent);
          }
        }
      });

    } else {
      this.error = 'firebase did not initialize properly.';
    }
  }
}

customElements.define('secret-hitler-landing', SecretHitlerLanding);