import React, { useState, Fragment } from 'react';
import Button from "../UI/Button";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import es from 'date-fns/locale/es';

const Calendar = props => {
    const [days, setDays] = useState([])
    const footer =
        days && days.length > 0
        ? `Has elegido ${days.length} día${(days.length !== 1) ? 's' : ''}.`
        : `Elige las fechas.`;

   
    return (
        <Fragment>
            <DayPicker
             locale={es} 
             mode="multiple"
             selected={days}
             onSelect={setDays}
             footer={footer}   
           />
           <div className="evento-fechas-action">
                <Button title="HECHO" onclick={() => props.onSetDays(days)}/>
            </div>
        </Fragment>
    )
}

export default Calendar;