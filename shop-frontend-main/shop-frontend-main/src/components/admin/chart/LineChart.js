import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line'
// import { data } from './LineData';

const LineChart = ({ day, data }) => {
    const [arr, setArr] = useState([
        {
            "id": "방문자수",
            "data": data.slice(data.length - day, data.length)
        }
    ])
    useEffect(() => {
        setArr([
            {
                "id": "방문자수",
                "data": data.slice(data.length - day, data.length)
            }
        ])
    }, [day])

    const options = {
        month: "short",
        day: "numeric",
    };

    return (
        <ResponsiveLine
            data={arr}
            margin={{ top: 20, right: 40, bottom: 30, left: 40 }}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
            }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                format: '',
                tickSize: 0,
                tickValues: 'every 1 days',
                legendOffset: -12,
            }}
            enableGridX={false}
            enablePoints={false}
            colors={{ scheme: 'set3' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
            enableSlices="x"

            sliceTooltip={({ slice }) => {
                return (
                    <div
                        style={{
                            background: 'white',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                        }}
                    >
                        {slice.points.map(point => (
                            <div
                                key={point.id}
                                style={{
                                    color: point.serieColor,
                                    padding: '3px 0',
                                }}
                            >
                                <strong>{point.data.x.toLocaleDateString("ko-KR", options)} - {point.serieId} </strong>{point.data.yFormatted}
                            </div>
                        ))}
                    </div>
                )
            }}
        />
    );
};

export default LineChart;