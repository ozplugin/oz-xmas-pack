import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './src/App';
import store from './src/store';

document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('oz_xmas_settings')) return;
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('oz_xmas_settings'));

    if (!document.querySelector('#wp-admin-bar-ozx-btn a')) return;
    document.querySelector('#wp-admin-bar-ozx-btn a').onclick = () => {
        let elem = document.querySelector('.ozx_settings-wrap')
        if (elem) {
            if (elem.className.indexOf('enabled') < 0)
            elem.classList.add('enabled')
            else
            elem.classList.remove('enabled')
        }
    }
})


//wp-admin-bar-ozx-btn