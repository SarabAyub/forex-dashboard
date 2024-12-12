import React from 'react';
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  LineSeries,
  BarSeries,
  AreaSeries,
  XAxis,
  YAxis,
  plotDataLengthBarWidth,
} from 'react-financial-charts';
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { Box } from '@mui/material';

const ChartRenderer = ({ quotes, chartType }) => {
  const xScale = scaleTime();
  const xAccessor = (d) => d?.date || new Date();
  const xExtents = [
    quotes.length > 100 ? quotes[quotes.length - 100].date : quotes[0]?.date || new Date(),
    quotes[quotes.length - 1]?.date || new Date(),
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'candlestick':
        return <CandlestickSeries width={plotDataLengthBarWidth} />;
      case 'line':
        return <LineSeries yAccessor={(d) => d.close} />;
      case 'bar':
        return (
          <BarSeries
            yAccessor={(d) => d.close}
            width={plotDataLengthBarWidth}
            fill={(d) => (d.close >= d.open ? 'green' : 'red')}
          />
        );
      case 'area':
        return <AreaSeries yAccessor={(d) => d.close} />;
      default:
        return <CandlestickSeries width={plotDataLengthBarWidth} />;
    }
  };

  return (
    <Box>
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
          {renderChart()}
        </Chart>
      </ChartCanvas>
    </Box>
  );
};

export default ChartRenderer;
