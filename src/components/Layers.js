import React, { useEffect, useRef, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layer from './Layer';

  export default function Layers() {
    const dispatch = useDispatch()
    const activeLayerId = useSelector(state => state.app.activeLayerId)
	const style = useSelector(state => state.app.style)
	const layers = useSelector(state => state.app.layers)

    const setLayers = (layers) => {
        // Math.floor(Math.random() * 100)
        dispatch({type: 'SET_LAYERS', 
            payload: layers
        })    
    }

    const addEmptyLayer = () => {
        dispatch({
            type: 'ADD_NEW_LAYER'
        })
    }

    const deleteLayers = async () => {
            try {
            let body = new URLSearchParams();
            body.set('action', 'ozx_delete_option');
            body.set('_wpnonce', ozx_vars.nonce);
            let res = await (await fetch(ozx_vars.ajax_url, {
                method: 'post',
                body
            })).json()
            if (res.success) {
                dispatch({
                    type: 'SET_LAYERS',
                    payload: res.payload
                })
                dispatch({type: 'LAYER_REMOVED', payload: 'all'})
            }
            }
            catch(err) {
                console.log(err)
            }
    }

    useEffect(() => {
        setLayers(ozx_vars.layers)
    }, [])

    return (
        <>
            <div class="ozx_h2 ozx_draggable">{ozx_lang.layers}</div>
            {layers.length > 0 ?
            <div class="ozx-layers-wrap">{layers.map((el, i) => {
                return (<Layer index={i+1} layer={el}/>)
            })}
            </div>
            :
            <>{ozx_lang.layersncre}</>}
            <div class="ozd-flex ozx-bottom-btn">
                {!activeLayerId && <div onClick={addEmptyLayer} class="ozx_btn">{ozx_lang.addnew}</div>}
                {(layers.length > 0) && <div onClick={deleteLayers} class="ozx_btn ozx_btn-danger ozms-1">{ozx_lang.deleteall}</div>}
            </div>
            <style>{style}</style>
        </>
    )
  }