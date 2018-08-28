import { LitElement, html, property } from '@polymer/lit-element';
import { GameStatus, Game } from './game.js';

export class SecretLitlerLanding extends LitElement {
  public db?: firebase.firestore.Firestore;
  public gameId?: string;
  public gameReference?: firebase.firestore.DocumentReference;
  public status?: GameStatus;
  @property({type: String})
  private error?: string;
  @property({type: Boolean})
  private loading: boolean = false;

  render() {
    return html`
      <style>
        .error {
          color: red;
        }
      </style>
      <div>Secret Lilter</div>
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <h1>Join Game</h1>
      <div>Name: <input id="name"></div>
      <div>Game ID: <input id="id"></div>
      <button @click="${() => { this.join(); }}">Join!</button>
      <h1>Create Game</h1>
      <button id="button" .disabled="${this.loading}" @click="${() => this.startGame()}">Start a new game</button>
    `;
  }

  private async startGame() {
    this.loading = true;
    if (this.db) {
      const game: Game = {
        status: GameStatus.INITIALIZING
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

  private async join() {
    // const nameInput = (this.shadowRoot!.getElementById('name') as HTMLInputElement);
    // const name = nameInput.value;
    const idInput = (this.shadowRoot!.getElementById('id') as HTMLInputElement);
    const id = idInput.value.trim().toUpperCase();

    if (this.db) {
      const gameQuery = this.db.collection('games').where('gameId', '==', id);
      const gameQuerySnap = await gameQuery.get();

      if (gameQuerySnap.empty) {
        this.error = 'game not found';
      } else {
        // const game = gameQuerySnap.docs[0];
      }
    } else {
      this.error = 'firebase db not found';
    }
  }
}

customElements.define('secret-litler-landing', SecretLitlerLanding);