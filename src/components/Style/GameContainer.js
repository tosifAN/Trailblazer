import styled from 'styled-components';

// Styled components for better UI
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
  width: 100%; // Add this
`;


const GameWrapper = styled.div`
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatsPanel = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1em;
  }
  
  p {
    margin: 5px 0;
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
  }
`;


export {
    GameContainer,
    GameWrapper,
    StatsPanel,
    StatItem
  };