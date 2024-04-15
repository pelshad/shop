import React from 'react';
import { ResponsivePie } from '@nivo/pie'


const DonutChart = ({ data }) => {
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 20, left: 80 }}
            sortByValue={true}
            innerRadius={0.5}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'set3' }}
            borderColor={{ theme: 'background' }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                // {
                //     anchor: 'bottom',
                //     direction: 'row',
                //     justify: false,
                //     translateX: 50,
                //     translateY: 50,
                //     itemsSpacing: 0,
                //     itemWidth: 100,
                //     itemHeight: 0,
                //     itemTextColor: '#999',
                //     itemDirection: 'left-to-right',
                //     itemOpacity: 1,
                //     symbolSize: 30,
                //     symbolShape: 'circle',
                //     effects: [
                //         {
                //             on: 'hover',
                //             style: {
                //                 itemTextColor: '#000'
                //             }
                //         }
                //     ]
                // }
            ]}
        />
    );
};

export default DonutChart;