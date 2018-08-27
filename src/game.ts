export enum GameStatus {
  CREATED,
  LANDING,
  LOBBY,
  JOIN,
}

export interface Game {
  gameId?: string;
  status: GameStatus;
}