export default function app(state = {
    elements: [],
    layers: [],
    activeLayerId: 0,
    removed: 0,
},action) {
    switch(action.type) { 
        case 'CHOOSE_ELEMENT':  
        let els = state.elements
            els = els.filter(el => el.element == action.payload.element)
            if (els.length) {
                els = state.elements.filter(el => el.element !== action.payload.element)
            }
            else {
                els = [...state.elements, action.payload]
            }
        return {...state, elements: els} 
        case 'SET_LAYERS':  return {...state, layers: action.payload}
        case 'LAYER_REMOVED':  return {...state, removed: action.payload}
        case 'SET_ACTIVE_LAYER':  return {...state, activeLayerId: action.payload} 
        case 'SET_BACKGROUND_ELEMENT':
        let layers = state.layers.map(
                (el) => {
                    if (el.id == action.payload.id) {
                        el.options.atts.element = action.payload.element
                        if (action.payload.image !== false)
                        el.options.atts.image = action.payload.image
                    }
                    return el
                }
                )
        return {...state, layers} 
        case 'SET_ACTIVITY':
        case 'SET_TYPE':
        case 'SET_MODE':
        case 'SET_POSITION':
        case 'SET_NAME':
        case 'SET_COLOR':
        let la = state.layers.map(
                (el) => {
                    if (el.id == action.payload.id) {
                        if (action.type == 'SET_ACTIVITY') {
                            el.options.show = action.payload == 'all' ? 'all' : ozx_vars.pageId
                        }
                        else if (action.type == 'SET_TYPE') {
                            el.type = action.payload.type
                        }
                        else if (action.type == 'SET_POSITION') {
                            el.options.atts.position = action.payload.position
                        }
                        else if (action.type == 'SET_NAME') {
                            el.name = action.payload.name
                        }
                        else if (action.type == 'SET_COLOR') {
                            el.options.atts.color = action.payload.color
                        }
                        else if (action.type == 'SET_MODE') {
                            if (typeof el.options.atts.mode == 'undefined')
                            el.options.atts.mode = ''
                            el.options.atts.mode = action.payload.mode
                        }
                    }
                    return el
                }
                )
        return {...state, layers: la} 
        case 'ADD_NEW_LAYER':  
        let layer = JSON.stringify(ozx_vars.layerTemplate)
            layer = JSON.parse(layer)
            layer.id = Date.now()
            layer.name = layer.name+' #'+state.layers.length
        return {...state, layers: [...state.layers, layer]} 
        default: return state;
    }
}