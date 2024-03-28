import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { CartProvider } from './context/CartProvider'
import { ProductsProvider } from './context/ProductsProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  //When you wrap a component or an entire application in <React.StrictMode>,
  //it activates additional checks and warnings for its descendants. 
  <React.StrictMode>
    <ProductsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductsProvider>
  </React.StrictMode>,
)