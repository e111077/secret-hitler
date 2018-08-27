import * as functions from 'firebase-functions';

export enum GameStatus {
  CREATED,
  LANDING,
  LOBBY,
  JOIN,
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface Game {
  gameId?: string;
  status: GameStatus;
}

function chooseRandomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * 26)];
}

async function generateUniqueId(collection: FirebaseFirestore.CollectionReference, lastId?: string): Promise<string> {
  let id = '';
  if (lastId === undefined) {
    for (let i = 0; i < 5; i++) {
      id += chooseRandomLetter();
    }
  } else {
    id = lastId + chooseRandomLetter();
  }

  const query = collection.where('id', '==', id);
  const qSnap = await query.get();
  const isUnique = qSnap.empty;

  if (isUnique) {
    return id;
  } else {
    return generateUniqueId(collection, id);
  }
}

exports.generateGameId = functions.firestore.document('games/{game}')
    .onCreate((snap) => {
      const games = snap.ref.parent;
      return generateUniqueId(games).then((uid) => {
        const initializedGame: Game = {
          gameId: uid,
          status: GameStatus.LOBBY,
        };

        return snap.ref.set(initializedGame).catch(() => {
          console.log('setting game reference failed');
        });
      }).catch(() => {
        console.log('getting query failed');
      });
    });