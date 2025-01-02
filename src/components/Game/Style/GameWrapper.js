import styled from 'styled-components';

export const GameWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a;
`;

export const GameCanvas = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  
  canvas {
    border: 2px solid #333;
    border-radius: 4px;
    margin: auto;
  }
`;