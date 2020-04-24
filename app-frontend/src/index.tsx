import { Injector } from '@furystack/inject'
import { initializeShadeRoot, createComponent } from '@furystack/shades'
import { App } from './components/app'
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const injector = new Injector()
window.addEventListener('DOMContentLoaded', () => {
  initializeShadeRoot({
    injector,
    jsxElement: <App />,
    rootElement: document.getElementById('root') as HTMLDivElement,
  })
})
