import { IoArrowBackSharp as BackIcon } from "react-icons/io5";
import { Fragment, useEffect , useState } from 'react';
import FechasStatsTabla from "./FechasStatsTabla";
import FechasHeatmap from "./FechasHeatmap";
import FechasPiechart from "./FechasPiechart";
import Loader from '../UI/Loader';
import { GiTumbleweed } from 'react-icons/gi';

const FechasStats = props => {
    const [haySelection, setHaySelection] = useState(false);
    const [isLoading, setIsloading] = useState(true)

    useEffect(() => {
        if (props.toMeasure.length > 0) {
            setHaySelection(true)
        }
        setIsloading(false)
    }, [props.toMeasure])
    return (
        <Fragment>
            {isLoading
                ? <div className="loader-wrapper"><Loader /></div>
                : <section className="fechas-stats">
                    <div className="stats-header">
                        <button onClick={props.onBack}><BackIcon /></button>
                        <h1>{props.evento.title}</h1>
                    </div>
                    {haySelection
                    ? <Fragment>
                        <FechasStatsTabla evento={props.evento} toMeasure={props.toMeasure} statsOf={props.statsOf} title={props.title}/>
                        <FechasHeatmap evento={props.evento} toMeasure={props.toMeasure} available={props.available} statsOf={props.statsOf} />
                        <FechasPiechart evento={props.evento} toMeasure={props.toMeasure} title={props.title} statsOf={props.statsOf}/>
                    </Fragment>
                    
                    : <section className="gapper center fallback"><p>{props.fallbackText}</p><div className="tumbleweed-wrapper"><GiTumbleweed /></div></section>
                    }    
                </section>
            }
        </Fragment>
    )
}

export default FechasStats;