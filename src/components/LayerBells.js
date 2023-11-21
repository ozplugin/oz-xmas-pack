import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isValidSelector } from '../functions/functions';

export default function LayerBells(props) {
    const dispatch = useDispatch()
    const layers = useSelector(state => state.app.layers)
    const activeLayerId = useSelector(state => state.app.activeLayerId)
    let thisLayer = layers.filter(l => l.id == activeLayerId)
    if (thisLayer.length) {
        thisLayer = thisLayer[0]
    }
    else {
        return null
    }

    const setMode = (e) => {
        let position = e.target.value
        dispatch({
            type: 'SET_POSITION',
            payload: {
                id: activeLayerId,
                position
            }}) 
            // let ind = position == 'top' ? 0 : 1
            // let sel = document.querySelector('[class*="ozx-bells"]')
            // sel.className = 'ozx-bells-temp ozx-bells-'+position
            // sel.style.backgroundImage = typeof ozx_vars.borders[ind] != 'undefined' ? 'url('+ozx_vars.borders[ind]+')' : '' 
            // document.body.append(sel)
    }

    // useEffect(() => {
    //     [...document.querySelectorAll('[class*="ozx-bells"]')].map(el => el.remove())
    //     let sel = document.createElement('div')
    //     let ind = thisLayer.options.atts.position == 'top' ? 0 : 1
    //         sel.className = 'ozx-bells-'+thisLayer.options.atts.position
    //         sel.style.backgroundImage = typeof ozx_vars.borders[ind] != 'undefined' ? 'url('+ozx_vars.borders[ind]+')' : '' 
    //     document.body.append(sel)
    //     return () => {
    //         sel.remove()
    //     }
    // }, [])

    return(
        <div class="oz_label">
                <span>{ozx_lang.position}</span>
                <select onChange={setMode}>
                    <option value="top" selected={thisLayer.options.atts.position == 'top'} >{ozx_lang.top}</option>
                    <option value="bottom" selected={thisLayer.options.atts.position == 'bottom'}>{ozx_lang.bottom}</option>
                </select>
            </div>
    )
}