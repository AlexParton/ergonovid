import Piechart from "../charts/Piechart";


const FechasPiechart = props => {
    const measureItem = {
        fechas: 'date',
        sitios: 'place',
        regalos: 'regalo'
    }

    return (
        <section className="fechas-piechart marger gapper neumorpher">
            <h3>DONUT DE {props.title}</h3>
            <Piechart evento={props.evento} votes={props.toMeasure} voteType={measureItem[props.statsOf]}/>
        </section>
    )
}

export default FechasPiechart;