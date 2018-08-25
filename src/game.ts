export enum GameStatus {
  INITIALIZING,
  LOBBY
}

export interface Game {
  id?: string;
  status: GameStatus;
}