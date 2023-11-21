import React, { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { createName, isValidSelector } from '../functions/functions';

export default function LayerSnowFlakes() {
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
    const inputRef = useRef(null)
    const [HasError, setHasError] = useState('')
    const [IsActiveCursor, setIsActiveCursor] = useState(false)
    const IsActiveCursorRef = useRef(IsActiveCursor)
    const [ClassVal, setClassVal] = useState(thisLayer.options.atts.element || '')
    const [InputFocus, setInputFocus] = useState(false)
    const patterns = ozx_vars.patterns;
    const [ActiveBack, setActiveBack] = useState(thisLayer.options.atts.image || 0)
    const ActiveBackRef = useRef(ActiveBack)
    const Flakes = useRef(null)
    
    const setElement = (e) => {
        let iter = document.querySelectorAll('.ozx-active-flakes').entries()
        while(true) {
            let result = iter.next();
            if (result.done) break;
            if (result.value) {
                result.value[1].style.backgroundImage = ''
                result.value[1].classList.remove('ozx-active-flakes')
            }
          }
        let elem = e.target.value
        if (elem && isValidSelector(elem) && document.querySelector(elem)) {
            document.querySelector(elem).classList.add('ozx-active-flakes')
            chooseElement(document.querySelector(elem))
            
        }
        else {
              chooseElement(e.target.value, true)
        }
    }

    const addActive = (e) => {
        if (isTools(e.target) || !IsActiveCursorRef.current) return;
        e.target.classList.add('ozx_focus')
    }

    const removeActive = (e) => {
        e.target.classList.remove('ozx_focus')
    }

    const enableCursor = () => {
        let v = !IsActiveCursor
        if (v) {
            let iter = document.querySelectorAll('.ozx-active-flakes').entries()
            while(true) {
                let result = iter.next();
                if (result.done) break;
                if (result.value) {
                    result.value[1].removeEventListener('click', chooseElement)
                    removeFlakes()
                    result.value[1].classList.remove('ozx-active-flakes')
                }
              }
            inputRef.current.value = ''
            chooseElement('', true)
        }
        setIsActiveCursor(v)
        IsActiveCursorRef.current = v 
    }

    const disableCursor = () => {
        setIsActiveCursor(false)
        IsActiveCursorRef.current = false
    }

    const isTools = (elem) => {
        let par = elem
        let ret = false;
        while(par) {
            if (par.id == 'oz_xmas_settings' || par.id == 'wpadminbar') {
                ret = true;
                break;
            }
            par = par.parentElement
        }
        return ret;
    }


    const highLightElement = (e) => {
        let istools = isTools(e.target)
        let iter = document.querySelectorAll('.ozx-active-flakes').entries()
        if (!IsActiveCursorRef.current) return;
        while(true) {
            let result = iter.next();
            if (result.done) break;
            if (result.value) {
                result.value[1].removeEventListener('click', chooseElement)
                result.value[1].classList.remove('ozx-active-flakes')
            }
          }
        if (istools) return false;
        e.target.classList.add('ozx-active-flakes')
        e.target.addEventListener('click', chooseElement)
    }

    const chooseElement = (e, element = false) => {
        if (element) {
            dispatch({
                type: 'SET_BACKGROUND_ELEMENT',
                payload: {
                    id: thisLayer.id, 
                    element: e,
                }
            })
            return false;       
        }
        let isElem = e.target && typeof e.target == 'object'
        let elem = isElem ? e.target : e
        if (isElem) {
        e.preventDefault();
        disableCursor()
        }
        if (isTools(elem)) return;
        let clsName = createName(elem)
            if (!isElem) {
                clsName = inputRef.current.value
            }
            else {
                inputRef.current.value = clsName
            }
        setClassVal(clsName)
        verifyElement(clsName, ActiveBackRef.current)
        dispatch({
            type: 'SET_BACKGROUND_ELEMENT',
            payload: {
                id: thisLayer.id, 
                element: clsName,
                image: ActiveBackRef.current
            }
        })
    }

    const  verifyElement = (elem, img) => {
        removeFlakes()
        if (thisLayer.options.atts.mode == 'page') {
            addFlakes()
            return;
        }
        if (isValidSelector(elem)) {
            elem =  document.querySelector(elem)
            addFlakes({container: elem})
            elem.classList.add('ozx-active-flakes')
            elem.classList.remove('ozx_focus')
            setHasError('')
        }
        else {
            setHasError('ozx-error')
        }
    }

    const setMode = (e) => {
        let mode = e.target.value
        removeFlakes()
        dispatch({
            type: 'SET_MODE',
            payload: {
                id: activeLayerId,
                mode
            }}) 
            addFlakes()        
    }

    const addFlakes = (params = {}) => {
        params = {...params, ...ozx_vars.flakes}
        if (thisLayer.options.atts.color) {
            params.color = thisLayer.options.atts.color
        }
        if (thisLayer.options.atts.mode == 'block') {
            if (isValidSelector(thisLayer.options.atts?.element)) {
            params.container = document.querySelector(thisLayer.options.atts?.element)
            }
        }
        Flakes.current = new Snowflakes(params);
    }

    const removeFlakes = () => {
        if (Flakes.current)
        Flakes.current.destroy();
    }

    const onColorChange = (color) => {
        dispatch({
            type: 'SET_COLOR',
            payload: {
                id: activeLayerId,
                color: color.hex
            }})   
    }

    const onColorChanged = (color) => {
        removeFlakes()
        addFlakes()
    }

    useEffect(() => {
        verifyElement(thisLayer.options.atts.element, thisLayer.options.atts.image)
    }, [])

    useEffect(() => {
        document.body.addEventListener('mousemove', highLightElement)
        document.body.addEventListener('mouseover', addActive)
        document.body.addEventListener('mouseout', removeActive)
        return () => { 
            removeFlakes()
            document.body.addEventListener('mousemove', highLightElement)
            document.body.removeEventListener('mouseover', addActive)
            document.body.removeEventListener('mouseout', removeActive)
        }
    }, [])

    return(
        <>
            <div class="oz_label">
                <span>{ozx_lang.mode}</span>
                <select onChange={setMode}>
                    <option value="page" selected={thisLayer.options.atts.mode == 'page'} >{ozx_lang.entirepage}</option>
                    <option value="block" selected={thisLayer.options.atts.mode == 'block'}>{ozx_lang.block}</option>
                </select>
            </div>
            <div class="oz_label">
                <span>{ozx_lang.color}</span>
                <SketchPicker
                color={ thisLayer.options.atts.color || '#fff' }
                onChange={ onColorChange }
                onChangeComplete={ onColorChanged }
                />
            </div>
            {thisLayer.options.atts?.mode == 'block' ?
                <div class="oz_label">
                <span>{ozx_lang.choosehtml}</span>
                    <div className={`ozd-flex ${HasError}`}> 
                            <input type="text" ref={inputRef} defaultValue={thisLayer.options.atts.element} class="oz_code ozw-100" onChange={setElement} data-focus={InputFocus} />
                            <div onClick={enableCursor} class={`ozx_btn-icon ${IsActiveCursor ? 'active' : ''}`}><svg width="24" class="ozicon" height="24" viewBox="0 0 24 24"><path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 4.702z"/></svg></div>            
                    </div>
                </div>
                : null
            }
        
        </>
    )
}