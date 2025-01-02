import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Game from './Game';

const GameWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <Game 
      playerData={location.state?.playerData} 
      onExit={() => navigate('/')}
    />
  );
};

export default GameWrapper;