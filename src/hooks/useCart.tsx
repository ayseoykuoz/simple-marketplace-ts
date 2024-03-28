import { useContext } from "react"
import CartContext from "../context/CartProvider"
import { UseCartContextType } from "../context/CartProvider"


// Defines a custom hook named useCart. The purpose of this hook is to abstract away the useContext 
// hook's direct usage, providing a simpler and more semantic API for accessing the cart context.
// The hook returns the value of useContext(CartContext). useContext is called with CartContext as 
// its argument, which tells React that this hook wants to access the context's value. This value 
// is what was provided to the CartContext.Provider's value prop somewhere higher up in the component 
// tree. The return type of useCart is UseCartContextType, ensuring that the hook's usage is type-safe. 
// This means you can expect the returned object to have a certain structure, including the state of 
// the cart and any actions you can dispatch to update it, as defined by UseCartContextType.


// export type UseCartContextType = ReturnType<typeof useCartContext>

const useCart = (): UseCartContextType => {
    return useContext(CartContext)

    // const CartContext = createContext<UseCartContextType>(initCartContextState)
}

// Finally, the useCart hook is exported, making it available for use in other parts of your application.
// By importing useCart in a component, you can easily access and interact with the cart context without 
// worrying about the underlying React context mechanics.
export default useCart