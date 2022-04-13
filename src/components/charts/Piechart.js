import React from 'react'
import ReactApexChart from "react-apexcharts";

const Piechart = props => {

    const labelsArray = [];
    props.votes.forEach((item) => labelsArray.push(item[props.voteType]));
    const votosArray = [];
    props.votes.forEach((item) => votosArray.push(item.users.length))
    const chartData = {
        chart: {
            type: 'donut',
            toolbar: {
                show: false,
            },
        },
        theme: {
            mode: 'light', 
            palette: 'palette1', 
            monochrome: {
                enabled: false,
            }
        },
        fill: {
            opacity: 1,
            type: 'solid',
            gradient: {
                shade: 'dark',
                type: "vertical",
                shadeIntensity: 0.7,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 0,
                stops: [0, 100],
                colorStops: []
            },
            pattern: {
                style: 'slantedLines',
                width: 6,
                height: 6,
                strokeWidth: 2,
            },
        },
        series: votosArray,
        labels: labelsArray,
        stroke: {
            show: false,
            curve: 'smooth',
            lineCap: 'butt',
            colors: ['#007849', '#F6C758'],
            width: 1,
            dashArray: 0,
        },
        legend: {
            show: false,
        },
        tooltip: {
            enabled: false,
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#333'],
                fontWeight: 'bold'
            },
            dropShadow: {
                color: '#dadada'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10,
                }, 
                donut: {
                    labels: {
                        show: true,
                        name: {
                            color: '#333',
                            fontSize: '40px',
                            fontFamily: 'var(--font)',
                            fontWeight: 700,
                        },
                        value: {
                            color: '#333',
                            fontSize: '40px',
                            fontFamily: 'var(--font)',
                            fontWeight: 700,
                        },
                        total: {
                            show: false,
                        }
                    }
                }
            },

        },
        
           
    }

    return <ReactApexChart options={chartData} series={chartData.series} type={chartData.chart.type}/>;
}

export default Piechart;