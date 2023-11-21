import React, {useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import Layers from './components/Layers';
import StylesRenders from './components/StylesRenders';
import Styles from './components/StylesRenders';
import './styles/styles.scss'


export default function App() {

  return (
    <>
    <div className="ozx_settings-wrap">
    <Draggable handle='.ozx_draggable'>
    <div className="ozx_settings">
        <Layers/>
    </div>
    </Draggable>
    </div>
    <StylesRenders/></>
  );
}