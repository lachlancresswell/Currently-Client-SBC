import React, { useState, useEffect } from 'react';
import { InfluxDB } from '@influxdata/influxdb-client-browser';
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { org, token, useNeighbourDataContext } from '../Hooks/neighbourDataContext';
import TuneIcon from '@mui/icons-material/Tune';
import '../Styles/PageChart.css'
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

export interface RowRtn {
    _field: string,
    _measurement: string,
    _start: string,
    _stop: string,
    _time: string,
    _value: number,
    host: string,
    name: string,
    result: string,
    table: number,
    type: string,
}

const legendStartState = [
    { voltage: true, current: true },
    { voltage: true, current: true },
    { voltage: true, current: true }
]

/**
 * Tests a URL to ensure it is accessible
 * @param host url to test
 * @returns resolves on success
 */
const testUrl = (host: string) => new Promise((res, rej) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {

            if (!(this.status >= 200 && this.status <= 299)) {
                return rej(`Cannot reach ${host}`);
            }

            return res('Success');
        }
    };
    xhttp.open("GET", host, true)
    xhttp.send();
});


export interface Phase {
    voltage: { y: number | string | null, x: Date }[]
    amperage: { y: number | string | null, x: Date }[]
}

interface Props { }

export const collectData = async (hostUrl: string, databaseUrl: string) => {
    await testUrl(hostUrl);
    await testUrl(databaseUrl)


    const db = new InfluxDB({ url: databaseUrl, token, timeout: 5000 });
    const queryApi = db.getQueryApi(org);

    let phases: Phase[] = [{
        voltage: [],
        amperage: [],
    }, {
        voltage: [],
        amperage: [],
    }, {
        voltage: [],
        amperage: [],
    }];

    const query = `
        from(bucket: "modbus")
        |> range(start: -10s)
        |> filter(fn: (r) => r["_measurement"] == "cpu")
        |> filter(fn: (r) => r["_field"] == "usage_idle" or r["_field"] == "usage_nice" or r["_field"] == "usage_system" or r["_field"] == "usage_user")
      |> filter(fn: (r) => r["cpu"] == "cpu0" or r["cpu"] == "cpu1" or r["cpu"] == "cpu2" or r["cpu"] == "cpu-total" or r["cpu"] == "cpu3")
        |> yield(name: "mean")
    `;

    queryApi.collectRows<RowRtn>(query).then((result) => {

        result!.forEach((row) => {
            switch (row._field) {
                case 'usage_user':
                    phases[0].amperage.push({ y: row._value, x: new Date(row._time) })
                    phases[1].amperage.push({ y: row._value, x: new Date(row._time) })
                    phases[2].amperage.push({ y: row._value, x: new Date(row._time) })
                    break;
                case 'usage_system':
                    phases[0].voltage.push({ y: row._value, x: new Date(row._time) })
                    phases[1].voltage.push({ y: row._value, x: new Date(row._time) })
                    phases[2].voltage.push({ y: row._value, x: new Date(row._time) })
                    break;
            }
        });

    });

    return phases;
}

const initialOptions = (endDate: number) => {
    const yaxisV = {
        showAlways: true,
        seriesName: 'Voltage',
        min: 180,
        max: 250,
        tickAmount: 4,
        labels: {
            style: {
                fontSize: '1em',
            },
            formatter: (value: any) => (value >= 200) ? value.toFixed(value % 1 !== 0 ? 1 : 0) + 'V' : undefined
        },
    }

    const yaxisC = {
        showAlways: true,
        seriesName: 'Current',
        opposite: true,
        labels: {
            style: {
                fontSize: '1em',
            },
            formatter: (value: any) => (value <= 10) ? value.toFixed(value % 1 !== 0 ? 1 : 0) + 'A' : undefined
        },
        min: 0,
        max: 20,
        tickAmount: 3,
        forceNiceScale: true
    }

    const datetimeFormatter = (value: string, timestamp: any) => {
        const startDate = new Date(value).getTime();
        const seconds = ((endDate - startDate) / 1000)
        let diff = ((endDate - startDate) / 1000);

        /**
         * Round diff to a multiple of ten if within +/- 1
         */
        if (diff % 10 >= 9) {
            diff = Math.ceil(diff);
        } else if (diff % 10 <= 1) {
            diff = Math.floor(diff);
        }

        let str = `0:${diff < 10 ? '0' + diff.toFixed(0) : diff.toFixed(0)}`;
        if (diff > 59) {
            const minutes = Math.floor(Math.round(seconds) / 60)
            str = `${minutes}`
            str += ':'
            const secondsRemaining = seconds - minutes * 60;
            if (secondsRemaining >= 1) {
                str += `${Math.round(secondsRemaining) < 10 ? '0' + secondsRemaining.toFixed(0) : secondsRemaining.toFixed(0)}`
            } else {
                str += '00'
            }
        }

        return `-${str}`;
    }


    return ({
        chart: {
            id: "mychart",
            foreColor: 'white',
            type: "area",
            height: '10vh',
            animations: {
                enabled: false
            },
            toolbar: {
                autoSelected: 'pan',
                show: false
            }
        }, noData: {
            text: 'Loading...'
        },
        colors: ['var(--l1-color)', 'var(--l1-color)', 'var(--l2-color)', 'var(--l2-color)', 'var(--l3-color)', 'var(--l3-color)'],
        fill: {
        },
        legend: {
            show: false
        },
        markers: {
            size: 0,
            colors: ['#7777ff'],
            showNullDataPoints: false,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: datetimeFormatter,
                rotate: 0,
                rotateAlways: false,
                style: {
                    fontSize: '1em', // specify the font size here
                },
            },
            tickAmount: 4,
        },
        yaxis: [
            // Phase 1
            yaxisV, yaxisC,
            // Phase 2 - hide axis labels to prevent duplicates
            { ...yaxisV, ...{ show: false } }, { ...yaxisC, ...{ show: false } },
            // Phase 3 - hide axis labels to prevent duplicates
            { ...yaxisV, ...{ show: false } }, { ...yaxisC, ...{ show: false } }
        ]
    } as ApexOptions)
}


const MyComponent: React.FC<Props> = () => {
    const { history } = useNeighbourDataContext();

    const WINDOW_SIZE = parseInt(localStorage.getItem('CHART_WINDOW_PERIOD') || '60'); // Distance to display in seconds
    const SCROLL_SIZE = WINDOW_SIZE / 2; // Distance to scroll in seconds

    /**
     * Data to display on the plot
     */
    const dataEndDate = new Date();
    const [plotData, setPlotData] = useState<Phase[]>(history);
    const [plotViewStartDate, setPlotViewStartDate] = useState<Date>(new Date(dataEndDate.getTime() - (WINDOW_SIZE * 1000)));
    const [plotViewEndDate, setPlotViewEndDate] = useState<Date>(new Date(dataEndDate.getTime()));
    const [legendViewStatus, setLegendViewStatus] = useState<{ [index: string]: boolean }[]>(legendStartState);
    const [plotOptions, setPlotOptions] = useState<ApexOptions>(initialOptions(dataEndDate.getTime()))

    /**
     * Whether the user has scrolled away from the latest data point
     */
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('CHART_WINDOW_PERIOD', WINDOW_SIZE.toString())
    }, [WINDOW_SIZE]);

    useEffect(() => {
        const newEndDate = history[0].voltage[history[0].voltage.length - 1].x;
        const newStartDate = new Date(history[0].voltage[history[0].voltage.length - 1].x.getTime() - (WINDOW_SIZE * 1000));

        if (!scrolled) {
            setPlotData(history)
            setPlotViewEndDate(newEndDate);
            setPlotViewStartDate(newStartDate)
        }

        /**
         * Update the displayed plot dates to be relative to the latest measured date
         */
        setPlotOptions(initialOptions(newEndDate.getTime()));
    }, [WINDOW_SIZE, history, scrolled])


    const toggleLegendElement = (phaseIndex: 1 | 2 | 3, category: "Voltage" | "Current") => {
        const hide = !!legendViewStatus[phaseIndex - 1][category.toLowerCase()];
        const cmd = hide ? "hideSeries" : "showSeries"
        const series = [`L${phaseIndex} ${category}`];

        ApexCharts.exec("mychart", cmd, series);
        setLegendViewStatus((prevLegendView) => {
            const newLegendView = [...prevLegendView]
            newLegendView[phaseIndex - 1][category.toLowerCase()] = !hide;
            return newLegendView
        });
    }

    const handleScrollBack = () => {
        if (plotViewStartDate.getTime() > plotData[0].voltage[0].x.getTime()) {
            setPlotViewStartDate(new Date(plotViewStartDate.getTime() - (SCROLL_SIZE * 1000)));
            setPlotViewEndDate(new Date(plotViewEndDate.getTime() - (SCROLL_SIZE * 1000)));
            setScrolled(true);
        }
    }

    return (
        <>
            <div style={{
                position: 'absolute',
                top: '11vh',
                height: '75vh',
                width: '100%',
                marginTop: '-2%',
                zIndex: -1, // prevent the chart from being clickable
            }}>
                <ReactApexChart type="line" options={plotOptions} series={configureData(plotData, plotViewStartDate, plotViewEndDate)} height={"100%"} />
            </div>
            <div className={`chart-buttons`}>
                <div className='chart-button' onClick={handleScrollBack}>
                    <KeyboardDoubleArrowLeft />
                </div>
                <div className={`chart-button l1 ${legendViewStatus[1 - 1].voltage ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(1, "Voltage")}>
                    V
                </div >
                <div className={`chart-button l1 ${legendViewStatus[1 - 1].current ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(1, "Current")}>
                    A
                </div>
                <div className={`chart-button l2 ${legendViewStatus[2 - 1].voltage ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(2, "Voltage")}>
                    V
                </div>
                <div className={`chart-button l2 ${legendViewStatus[2 - 1].current ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(2, "Current")}>
                    A
                </div>
                <div className={`chart-button l3 ${legendViewStatus[3 - 1].voltage ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(3, "Voltage")}>
                    V
                </div>
                <div className={`chart-button l3 ${legendViewStatus[3 - 1].current ? '' : 'strikethrough'}`} onClick={() => toggleLegendElement(3, "Current")}>
                    A
                </div>
                <div className='chart-button' onClick={() => {
                    if (plotViewEndDate.getTime() < dataEndDate.getTime()) {
                        setPlotViewStartDate(new Date(plotViewStartDate.getTime() + (SCROLL_SIZE * 1000)));
                        setPlotViewEndDate(new Date(plotViewEndDate.getTime() + (SCROLL_SIZE * 1000)));
                    } else {
                        setScrolled(false);
                    }
                }}>
                    <KeyboardDoubleArrowRight />
                </div>
                <div className='chart-button'>
                    <NavLink to={"/options/chart"}>
                        <TuneIcon />
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default MyComponent;


const configureData = (data: Phase[] | undefined | null, startDate: Date, endDate: Date) => {
    if (!data || !data.length) {
        data = [{
            voltage: [{}],
            amperage: [{}]
        }, {
            voltage: [{}],
            amperage: [{}]
        }, {
            voltage: [{}],
            amperage: [{}]
        }] as any
    }

    data![0].voltage.splice(0, 0, { x: startDate, y: 0 }); // Set minimum window width

    const getValuesBetweenDates = (phases: Phase[], startDate: Date, endDate: Date): Phase[] => {
        const filteredPhases: Phase[] = [];

        phases.forEach((phase) => {
            const filteredVoltage = phase.voltage.filter((v) => {
                const date = new Date(v.x);
                return date >= startDate && date <= endDate;
            });

            const filteredAmperage = phase.amperage.filter((a) => {
                const date = new Date(a.x);
                return date >= startDate && date <= endDate;
            });

            filteredPhases.push({
                voltage: filteredVoltage,
                amperage: filteredAmperage,
            });
        });

        return filteredPhases;
    };

    const trimmedData = getValuesBetweenDates(data!, startDate, endDate);

    return [
        {
            name: "L1 Voltage",
            data: trimmedData![0].voltage,
            type: 'line',
        },
        {
            name: "L1 Current",
            data: trimmedData![0].amperage,
            type: 'line',
        },
        {
            name: "L2 Voltage",
            data: trimmedData![1].voltage,
            type: 'line',
        },
        {
            name: "L2 Current",
            data: trimmedData![1].amperage,
            type: 'line',
        },
        {
            name: "L3 Voltage",
            data: trimmedData![2].voltage,
            type: 'line',
        },
        {
            name: "L3 Current",
            data: trimmedData![2].amperage,
            type: 'line',
        },
    ]
};
