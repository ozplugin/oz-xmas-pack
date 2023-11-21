import React, {useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isValidSelector } from '../functions/functions';

export default function StylesRenders() {
    const layers = useSelector(state => state.app.layers)
    const removed = useSelector(state => state.app.removed)
    const patterns = ozx_vars.patterns
    const activeLayerId = useSelector(state => state.app.activeLayerId)

    let bottomVisible = useRef('none');
    let topVisible = useRef('none');

    const Flakes = useRef([])

    const addFlakes = (params = {}, id = 0) => {
        params = {...params, ...ozx_vars.flakes}
        // if (thisLayer.options.atts.color) {
        //     params.color = thisLayer.options.atts.color
        // }
        // if (thisLayer.options.atts.mode == 'block') {
        //     if (isValidSelector(thisLayer.options.atts?.element)) {
        //     params.container = document.querySelector(thisLayer.options.atts?.element)
        //     }
        //}
        if (Flakes.current.length) {
            Flakes.current = Flakes.current.filter(flake => {
                let isId = flake.id == id
                    if (isId) {
                        flake.flakes.destroy()
                    }
                return !isId
            })
        }
        Flakes.current = [...Flakes.current, {id, flakes: new Snowflakes(params)}];
    }

    const removeFlakes = () => {
        if (!Flakes.current.length) return
        Flakes.current.map(flake => {
            if (flake.id == activeLayerId) {
            flake.flakes.destroy();
            }
        })
    }

    let style = '';
    {layers.filter(el => el.type == 'background' && el.id != activeLayerId).forEach(el => {
        style += el.options.atts.element+"\n"+"{background-image: url("+patterns[el.options.atts.image]+"); background-size: 250px;}\n";
    })}

    const onEditOption = () => {
        removeFlakes();
    }

    const onDisableOption = () => {
        let enumLayers = layers.length > 0 ? layers : ozx_vars.layers
        enumLayers.forEach(layer => {
            if (layer.options.show == 'all' || layer.options.show == ozx_vars.pageId) {
            if (layer.type == 'snowflakes') {
                    let params = {}
                    let id = layer.id 
                    if (layer.options.atts.color) {
                        params.color = layer.options.atts.color
                    }
                    if (layer.options.atts.mode == 'page') {
                    }
                    else if (layer.options.atts.mode == 'block') {
                        if (isValidSelector(layer.options.atts?.element)) {
                        params.container = document.querySelector(layer.options.atts?.element)
                        document.querySelector(layer.options.atts?.element).style.position = 'relative'
                        }
                    }
                    addFlakes(params, id)
                }
            }
        })
    }

    useEffect(() => {
        if (activeLayerId > 0)
        onEditOption()
        else 
        onDisableOption()
    }, [activeLayerId])

    useEffect(() => {
        if (removed != 0) {
            if (removed == 'all') {
                Flakes.current.map( fl => fl.flakes.destroy())
            }
            else {
            let fil = Flakes.current.filter( fl => fl.id == removed.id)
                if (fil.length > 0) {
                    fil[0].flakes.destroy()
                }
            }
        }
    }, [removed])

    let bottomReady = false;
    let topReady = false;

    return (
        <>
      {layers.map((layer) => {
            let tpl = null;
            if (layer.options.show == 'all' || layer.options.show == ozx_vars.pageId) {
                if (layer.type == 'bells') {
                    if (layer.options.atts.position == 'top' && !topReady) {
                        topReady = true;
                        tpl = <div style={{backgroundImage: 'url('+ozx_vars.borders[0]+')'}} class="ozx-bells-top"></div>
                    }
                    else if (layer.options.atts.position == 'bottom' && !bottomReady) {
                        bottomReady = true;
                        tpl = <div style={{backgroundImage: 'url('+ozx_vars.borders[1]+')'}} class="ozx-bells-bottom"></div>
                    }
                }
            }
            return tpl;
        })}
            <style>
                    {`${style}`}
            </style>
        </>
    );
  }