import React, { useEffect, useRef, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeActiveElement } from '../functions/functions';
import LayerBackround from './LayerBackround';
import LayerBells from './LayerBells';
import LayerSnowFlakes from './LayerSnowFlakes';

  export default function Layer(props) {
        const activeLayerId = useSelector(state => state.app.activeLayerId)
        const dispatch = useDispatch();
        const IsHide = activeLayerId == props.layer.id ? '' : 'ozd-none'
        const removeLayer = async () => {
            try {
                let body = new URLSearchParams();
                let removed = props.layer;
                body.set('action', 'ozx_delete_layer');
                body.set('_wpnonce', ozx_vars.nonce);
                body.set('layer', props.layer.id);
                let res = await (await fetch(ozx_vars.ajax_url, {
                    method: 'post',
                    body
                })).json()
                if (res.success) {
                        dispatch({
                            type: 'SET_LAYERS',
                            payload: res.payload
                        })
                        dispatch({type: 'LAYER_REMOVED', payload: removed})
                    }
                }
                catch(err) {
                    console.log(err)
                }
        }
        const [Toggle, setToggle] = useState(false)
        const BtnName = !Toggle ? ozx_lang.edit : ozx_lang.save;
        const layers = useSelector(state => state.app.layers)

        const editOption = () => {
            let iter = document.querySelectorAll('.ozx-active').entries()
            while(true) {
                let result = iter.next();
                if (result.done) break;
                if (result.value) {
                    result.value[1].style.backgroundImage = ''
                    result.value[1].classList.remove('ozx-active')
                }
              }

            if (Toggle) {
                saveOption()
            } 
            dispatch({
                type: 'SET_ACTIVE_LAYER',
                payload: !Toggle ? props.layer.id : ''
            })
            setToggle(!Toggle)
        }

        const setActivity = (e) => {
            let activity = e.target.value
            dispatch({
                type: 'SET_ACTIVITY',
                payload: {
                    id: activeLayerId,
                    activity
                }})
        }

        const setType = (e) => {
            let type = e.target.value
            removeActiveElement()
            dispatch({
                type: 'SET_TYPE',
                payload: {
                    id: activeLayerId,
                    type
                }})         
        }

        const setTitle = (e) => {
            dispatch({
                type: 'SET_NAME',
                payload: {
                    id: activeLayerId,
                    name: e.target.value
                }}) 
        }

        const saveOption = async () => {
            try {
            let body = new URLSearchParams();
            body.set('action', 'ozx_save_option');
            body.set('_wpnonce', ozx_vars.nonce);
            body.set('layers', JSON.stringify(layers));
            let res = await (await fetch(ozx_vars.ajax_url, {
                method: 'post',
                body
            })).json()
            }
            catch(err) {
                console.log(err)
            }
        }

        let layerOption = null
        switch(props.layer.type) {
            case 'background' :
                layerOption = <LayerBackround />
            break;
            case 'snowflakes' :
                layerOption = <LayerSnowFlakes />
            break;
            case 'bells' :
                layerOption = <LayerBells />
            break;
            default:
                layerOption = null
        }

        return(
            <div class="ozx_layer">
                {Toggle ? 
                <input type="text" onInput={setTitle} defaultValue={props.layer.name} class="ozx_layer-title-editable" />
                :
                <div class="ozx_layer-title ozmb-1">{props.layer.name}</div>
                }
                <div className={`ozx_layer-body ozmb-1 ${IsHide}`}>
                    <div class="oz_label">
                        <span>{ozx_lang.effecttype}</span>
                        <select onChange={setType}>
                            <option selected={props.layer.type == 'background'} value="background">{ozx_lang.background}</option>
                            <option selected={props.layer.type == 'snowflakes'} value="snowflakes">{ozx_lang.snowflakes}</option>
                            <option selected={props.layer.type == 'bells'} value="bells">{ozx_lang.border}</option>
                        </select>
                    </div>
                    <div class="oz_label">
                        <span>{ozx_lang.activity}</span>
                        <select onChange={setActivity}>
                            <option value="all" selected={props.layer.options.show == 'all'}>{ozx_lang.allpages}</option>
                            <option value={ozx_vars.pageId} selected={props.layer.options.show == ozx_vars.pageId}>{ozx_lang.onlythis}</option>
                            {props.layer.options.show != 'all' && ozx_vars.pageId != props.layer.options.show ?
                            <option value="page" selected={props.layer.options.show !== 'all'}>{ozx_lang.onlywithid} {props.layer.options.show}</option>
                            : null }
                        </select>
                    </div>
                    {IsHide == '' && layerOption}
                </div>
                <div className='ozx_layer-bottom'>
                    <div class="ozx_btn" onClick={editOption}>{BtnName}</div>
                    <div class="ozx_btn ozx_btn-danger ozms-1" onClick={removeLayer}>{ozx_lang.remove}</div>
                </div>
            </div>
        )
  }