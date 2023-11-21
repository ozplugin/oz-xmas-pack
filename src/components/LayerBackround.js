import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isValidSelector } from '../functions/functions';

export default function LayerBackround() {
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

    const setUnFocus = () => {
        return
        setInputFocus(false)
        let iter = document.querySelectorAll('.ozx-active').entries()
        while(true) {
            let result = iter.next();
            if (result.done) break;
            if (result.value) {
                result.value[1].removeEventListener('click', chooseElement)
                result.value[1].classList.remove('ozx-active')
                result.value[1].style.backgroundImage = ''
            }
          }
    }

    const setFocus = () => {
        return
        setInputFocus(true)
    }
    
    const setElement = (e) => {
        let iter = document.querySelectorAll('.ozx-active').entries()
        while(true) {
            let result = iter.next();
            if (result.done) break;
            if (result.value) {
                result.value[1].style.backgroundImage = ''
                result.value[1].classList.remove('ozx-active')
            }
          }
        let elem = e.target.value
        if (elem && isValidSelector(elem) && document.querySelector(elem)) {
            document.querySelector(elem).classList.add('ozx-active')
            chooseElement(document.querySelector(elem))
            
        }
        else {
              chooseElement(e.target.value, true)
        }
    }

    const enableCursor = () => {
        let v = !IsActiveCursor
        if (v) {
            let iter = document.querySelectorAll('.ozx-active').entries()
            while(true) {
                let result = iter.next();
                if (result.done) break;
                if (result.value) {
                    result.value[1].removeEventListener('click', chooseElement)
                    result.value[1].style.backgroundImage = ''
                    result.value[1].classList.remove('ozx-active')
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
        let iter = document.querySelectorAll('.ozx-active').entries()
        if (!IsActiveCursorRef.current) return;
        while(true) {
            let result = iter.next();
            if (result.done) break;
            if (result.value) {
                result.value[1].removeEventListener('click', chooseElement)
                result.value[1].classList.remove('ozx-active')
                result.value[1].style.backgroundImage = ''
            }
          }
        if (istools) return false;
        e.target.classList.add('ozx-active')
        e.target.addEventListener('click', chooseElement)
    }

    const createName = (element) => {
        let skippedTags = ['BODY', 'HTML']
        let name = '';
        if (element.id) {
            name = element.tagName+'#'+element.id
        }
        else {
            if (element.parentElement && element.parentElement.parentElement) {
                name += element.parentElement.parentElement.tagName
                if (skippedTags.indexOf(element.parentElement.parentElement.tagName) < 0) {

                    if (element.parentElement.parentElement.id) {
                        name += '#'+element.parentElement.parentElement.id+' ';
                    }
                    else if (element.parentElement.parentElement.className) {
                        name += '.'+element.parentElement.parentElement.className.replaceAll(' ', '.')+' ';
                    }

                }
            }

            if (element.parentElement) {
                name += ' '+element.parentElement.tagName
                if (skippedTags.indexOf(element.parentElement.tagName) < 0) {
                    if (element.parentElement.id) {
                        name += '#'+element.parentElement.id+' ';
                    }
                    else if (element.parentElement.className) {
                        name += '.'+element.parentElement.className.replaceAll(' ', '.')+' ';
                    }
                }
            }

            name += name !== '' ? ' '+element.tagName : element.tagName 

            name = name.replace('ozx-active', '')

            if (element.className && skippedTags.indexOf(element.tagName) < 0) {
                let n = element.className.replace('ozx-active', '')
                if (n)
                name += '.'+n.trim().replaceAll(' ', '.')
            }
        }

        return name;
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

    const chooseImage = (i) => {
        if (HasError) return;
        setActiveBack(i); 
        ActiveBackRef.current = i;
        verifyElement(ClassVal, i)
        dispatch({
            type: 'SET_BACKGROUND_ELEMENT',
            payload: {
                id: thisLayer.id, 
                element: ClassVal,
                image: ActiveBackRef.current
            }
        })
    }

    const  verifyElement = (elem, img) => {
        if (isValidSelector(elem)) {
            elem =  document.querySelector(elem)
            elem.style.backgroundImage = 'url('+patterns[img]+')'
            elem.classList.add('ozx-active')
            setHasError('')
        }
        else {
            setHasError('ozx-error')
        }
    }

    useEffect(() => {
        verifyElement(thisLayer.options.atts.element, thisLayer.options.atts.image)
    }, [])

    useEffect(() => {
        document.body.addEventListener('mousemove', highLightElement)
        return () => { 
            document.body.addEventListener('mousemove', highLightElement)
        }
    }, [])


    return(
        <>
        <div class="oz_label">
            <span>{ozx_lang.choosehtml}</span>
            <div className={`ozd-flex ${HasError}`}>
                <input type="text" ref={inputRef} defaultValue={thisLayer.options.atts.element} class="oz_code ozw-100" onBlur={setUnFocus} onFocus={setFocus} onChange={setElement} data-focus={InputFocus} />
                <div onClick={enableCursor} class={`ozx_btn-icon ${IsActiveCursor ? 'active' : ''}`}><svg width="24" class="ozicon" height="24" viewBox="0 0 24 24"><path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 4.702z"/></svg></div>
            </div>
        </div>
        <div class="oz_label">
            <span>{ozx_lang.background}</span>
            <div class="ozx_select-ul">
                {patterns.map((pattern, i) => {
                    let selected = thisLayer.options.atts.image === i ? 'selected' : '';
                    return(
                    <div data-index={i} class={`ozx_select-li ${selected}`} onClick={() => {chooseImage(i)}} style={{backgroundImage: 'url('+pattern+')'}}></div>
                    )
                })}
            </div>
        </div>
        </>
    )
}