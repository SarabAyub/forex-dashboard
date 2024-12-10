import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useWebSocket from '../../hooks/useWebSocket';
import ChartRenderer from '../../components/chart/ChartRenderer';
import { Container, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLazySubscribeQuery } from '../../features/apiSlice';
import Dropdown from '../../components/core/dropdown/dropdown';

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
  const [chartType, setChartType] = useState('candlestick'); 
  const [subscribeSymbol, setSubscribeSymbol] = useState('EURUSD');
  const [subscribe] = useLazySubscribeQuery();
  const sessionId = useSelector((state) => state.session.sessionId);
  const websocketUrl = sessionId ? `ws://212.117.171.68:5000/OnQuote?id=${sessionId}` : null;
  const MAX_QUOTES = 500;
  const { data: websocketData, error, closeSocket } = useWebSocket(websocketUrl);

  // Handle subscription when sessionId changes
  useEffect(() => {
    if (sessionId) {
      console.log('Subscribing with sessionId:', sessionId);
      subscribe({ id: sessionId, symbol: subscribeSymbol });
    }
  }, [sessionId, subscribe , subscribeSymbol]);

  // Process WebSocket messages
  useEffect(() => {
    if (websocketData && websocketData.type === 'Quote' && websocketData.data.symbol ===  subscribeSymbol) {
      const { time, bid, ask, volume } = websocketData.data;
      const date = new Date(time);
      const lastQuote = quotes[quotes.length - 1] || { close: (bid + ask) / 2 };

      const newQuote = {
        date,
        open: lastQuote.close,
        high: Math.max(lastQuote.close, (bid + ask) / 2),
        low: Math.min(lastQuote.close, (bid + ask) / 2),
        close: (bid + ask) / 2,
        volume: volume || 0,
      };

      setQuotes((prevQuotes) => {
        const updatedQuotes = [...prevQuotes, newQuote];
        // Limit the number of stored quotes
        return updatedQuotes.length > MAX_QUOTES
          ? updatedQuotes.slice(updatedQuotes.length - MAX_QUOTES)
          : updatedQuotes;
      });
    }
  }, [websocketData]);

  const handleSubscribeSymbolChange = (symbol) => {
    setSubscribeSymbol(symbol);
    setQuotes([]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {subscribeSymbol} Chart
      </Typography>
      <Dropdown
        label="Subscribe Symbol"
        value={subscribeSymbol}
        options={[
          { label: 'EURUSD', value: 'EURUSD' },
          { label: 'GBPUSD', value: 'GBPUSD' },
          { label: 'USDJPY', value: 'USDJPY' },
          { label: 'AUDUSD', value: 'AUDUSD' },
        ]}
        onChange={handleSubscribeSymbolChange}
      />
      <Dropdown
        label="Chart Type"
        value={chartType}
        options={[
          { label: 'Candlestick', value: 'candlestick' },
          { label: 'Line', value: 'line' },
          { label: 'Bar', value: 'bar' },
          { label: 'Area', value: 'area' },
        ]}
        onChange={setChartType}
      />
      {error ? (
        <Typography variant="body1" color="error">
          WebSocket Error: {error.message}
        </Typography>
      ) : quotes.length > 0 ? (
        <StyledContainer>
          <ChartRenderer quotes={quotes} chartType={chartType} />
        </StyledContainer>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default ChartPage;
