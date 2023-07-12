import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import {ApiProvider} from '../src/components/ApiContext'
import reduxConfig from './redux'

const store = reduxConfig()
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <CookiesProvider>
            <ApiProvider>
                <Provider store={store}>
                    <App />
                </Provider>
            </ApiProvider>
        </CookiesProvider>
    </BrowserRouter>,
)
