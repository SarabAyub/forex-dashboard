import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useWebSocket from './useWebSocket';
import ChartRenderer from './ChartRenderer';
import { Container, CircularProgress, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLazySubscribeQuery } from '../../features/apiSlice';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.shadows[4],
  padding: '20px',
  marginTop: '20px',
  width: '800px',
}));

const ChartPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);
  const [subscribe, { data: subscribeData, isSuccess }] = useLazySubscribeQuery();
  const sessionId = useSelector((state) => state.session.sessionId);
  const websocketUrl = `ws://212.117.171.68:5000/OnQuote?id=${sessionId}`;
  const MAX_QUOTES = 500;

  useEffect(() => {
    if (sessionId) {
      console.log('Subscribing with sessionId:', sessionId);
      subscribe({ id: sessionId, symbol: 'EURUSD' });
    }
  }, [sessionId, subscribe]);


  const handleIncomingMessage = (event) => {
    try {
      const rawQuote = JSON.parse(event.data);
      if (rawQuote.type === 'Quote' && rawQuote.data.symbol === 'EURUSD') {
        const { time, bid, ask, volume } = rawQuote.data;
        const date = new Date(time);

        const lastQuote = quotes[quotes.length - 1] || { close: (bid + ask) / 2 };

        const newQuote = {
          date,
          open: lastQuote.close,
          high: Math.max(lastQuote.close, (bid + ask) / 2),
          low: Math.min(lastQuote.close, (bid + ask) / 2),
          close: (bid + ask) / 2,
          volume: volume || 10,
        };
        
        setQuotes((prev) => {
          const updatedQuotes = [...prev, newQuote];
          if (updatedQuotes.length > MAX_QUOTES) {
            return updatedQuotes.slice(-MAX_QUOTES);
          }
        console.log('Received new quote:', updatedQuotes);
          return updatedQuotes;
        });
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };

  const handleWebSocketError = (message) => setError(message);

  useWebSocket(websocketUrl, handleIncomingMessage, handleWebSocketError, quotes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        EURUSD Chart
      </Typography>
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : quotes.length > 0 ? (
        <StyledContainer>
          <ChartRenderer quotes={quotes} />
        </StyledContainer>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default ChartPage;
