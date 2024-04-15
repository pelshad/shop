import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { comma } from 'utils/commaReplace';

const Chart = ({ data, day }) => {
    const testA = {
        tickSize: 3,
        tickPadding: 6,
        tickRotation: 0,
    }
    if (day > 15) {
        testA.tickRotation = -30
    }
    return (
        <ResponsiveBar
            data={data.slice(data.length - day, data.length)}
            keys={[
                '일 판매 금액',
            ]}
            indexBy="date"
            margin={{ top: 50, right: 70, bottom: 30, left: 70 }}
            padding={0.30}
            innerPadding={2}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'set3' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'fries'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'sandwich'
                    },
                    id: 'lines'
                }
            ]}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
            axisLeft={{
                format: value =>
                    Number(value).toLocaleString('ru-RU', {
                        minimumFractionDigits: 0,
                    }),
            }}

            axisBottom={testA}
            tooltip={({ id, value, color }) => (
                <div
                    style={{
                        padding: 12,
                        color,
                        background: 'white',
                        border: '1px solid #22222240'
                    }}
                >
                    <strong>
                        {id} : {comma(value)}원
                    </strong>
                </div>
            )}
        />

    );
};

export default Chart;