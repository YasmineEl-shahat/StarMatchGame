import  React, {useState} from 'react';

import Game from './Game';

const StarMatch = () =>{
  //when clicking play again we unmount game and mount it again
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}


export function App() {
  
  return (
    <StarMatch />
  );
}
