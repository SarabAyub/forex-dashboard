import React from 'react';
import { ChartCanvas, Chart, CandlestickSeries, XAxis, YAxis, plotDataLengthBarWidth } from 'react-financial-charts';
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

const ChartRenderer = ({ quotes }) => {
    const xScale = scaleTime();
    const xAccessor = (d) => d?.date || new Date();
    const xExtents = [
        quotes.length > 100 ? quotes[quotes.length - 100].date : quotes[0]?.date || new Date(),
        quotes[quotes.length - 1]?.date || new Date(),
    ];

    return (
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
                <YAxis axisAt="left" orient="left" ticks={4} />
                <CandlestickSeries width={plotDataLengthBarWidth} />
            </Chart>
        </ChartCanvas>
    );
};

export default ChartRenderer;
