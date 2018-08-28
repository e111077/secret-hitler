export enum GameStatus {
  INITIALIZING,
  LOBBY,
}

export interface Game {
  gameId?: string;
  status: GameStatus;
}