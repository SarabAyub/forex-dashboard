import React, { useEffect, useState } from 'react';
import { useLazySubscribeQuery } from '../features/apiSlice';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  plotDataLengthBarWidth,
} from 'react-financial-charts';
import { scaleTime } from 'd3-scale';
import { utcMinute } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const ChartPage = () => {
  const [quotes, setQuotes] = useState([]);
  const sessionId = localStorage.getItem('sessionId');
  const websocketUrl = `ws://212.117.171.68:5000/OnQuote?id=${sessionId}`;

  const [subscribe, { data: subscribeData, isSuccess }] = useLazySubscribeQuery();

  useEffect(() => {
    if (sessionId) {
      console.log('Subscribing with sessionId:', sessionId);
      subscribe({ id: sessionId, symbol: 'EURUSD' });
    }
  }, [sessionId, subscribe]);

  useEffect(() => {
    if (isSuccess && subscribeData === 'OK') {
      console.log('Subscription successful, connecting to WebSocket...');
      const socket = new WebSocket(websocketUrl);

      socket.onmessage = (event) => {
        const rawQuote = JSON.parse(event.data);
        console.log('WebSocket message:', rawQuote);

        if (rawQuote.type === 'Quote' && rawQuote.data.symbol === 'EURUSD') {
          try {
            const { time, bid, ask, volume } = rawQuote.data;
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

            setQuotes((prev) => [...prev, newQuote]);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        socket.close();
        console.log('WebSocket closed');
      };
    } else if (subscribeData && subscribeData !== 'OK') {
      console.error('Subscription failed:', subscribeData);
    }
  }, [isSuccess, subscribeData, websocketUrl, quotes]);

  console.log('Quotes:', quotes);

  const xScale = scaleTime();
  const xAccessor = (d) => d?.date;
  const xExtents = [
    quotes.length > 100 ? quotes[quotes.length - 100].date : quotes[0]?.date,
    quotes[quotes.length - 1]?.date,
  ];

  return (
    <div>
      <h1>EURUSD Chart</h1>
      {quotes.length > 0 ? (
        <ChartCanvas
          height={400}
          width={800}
          ratio={3}
          margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
          data={quotes}
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={xExtents}
        >
          <Chart id={1} yExtents={(d) => [d.high, d.low]}>
            <XAxis axisAt="bottom" orient="bottom" tickFormat={timeFormat('%H:%M')} />
            <YAxis axisAt="left" orient="left" ticks={5} />
            <CandlestickSeries width={plotDataLengthBarWidth} />
          </Chart>
        </ChartCanvas>
      ) : (
        <p>Waiting for quotes...</p>
      )}
    </div>
  );
};

export default ChartPage;
