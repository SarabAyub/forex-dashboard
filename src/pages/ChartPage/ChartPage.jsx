import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useWebSocket from '../../hooks/useWebSocket';
import ChartRenderer from '../../components/chart/ChartRenderer';
import { CircularProgress, Typography } from '@mui/material';
import { FlexCol, FlexRow, OptionsContainer, StyledContainer } from './ChartPage.styles';
import { useLazySubscribeQuery } from '../../features/apiSlice';
import Dropdown from '../../components/core/dropdown/dropdown';
import LogoutButton from '../../components/logout-button/LogoutButton';

const ChartPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [chartType, setChartType] = useState('candlestick');
  const [subscribeSymbol, setSubscribeSymbol] = useState('EURUSD');
  const [subscribe] = useLazySubscribeQuery();
  const sessionId = useSelector((state) => state.session.sessionId);
  const websocketUrl = sessionId ? `ws://212.117.171.68:5000/OnQuote?id=${sessionId}` : null;
  const MAX_QUOTES = 500;
  const { data: websocketData, error, closeSocket } = useWebSocket(websocketUrl);

  useEffect(() => {
    if (sessionId) {
      console.log('Subscribing with sessionId:', sessionId);
      subscribe({ id: sessionId, symbol: subscribeSymbol });
    }
  }, [sessionId, subscribe, subscribeSymbol]);

  useEffect(() => {
    if (websocketData && websocketData.type === 'Quote' && websocketData.data.symbol === subscribeSymbol) {
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
    <FlexCol >
      <Typography variant="h4" component="h1" gutterBottom>
        {subscribeSymbol} Chart
      </Typography>
      <FlexRow>
        {error ? (
          <Typography variant="body1" color="error">
            WebSocket Error: {error.message}
          </Typography>
        ) : quotes.length > 0 ? (
          <StyledContainer>
            <ChartRenderer quotes={quotes} chartType={chartType} />
          </StyledContainer>
        ) : (
          <StyledContainer>
            <CircularProgress />
            <Typography variant="body1">Waiting for quotes...</Typography>
          </StyledContainer>
        )}
        <OptionsContainer>
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
          <LogoutButton closeSocket={closeSocket} />
        </OptionsContainer>
      </FlexRow>
    </FlexCol>
  );
};

export default ChartPage;
