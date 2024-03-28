import { useMemo, useReducer, createContext, ReactElement } from "react"

export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    qty: number,
}

type CartStateType = { cart: CartItemType[] }

const initCartState: CartStateType = { cart: [] }

const REDUCER_ACTION_TYPE = {
    ADD: "ADD",
    REMOVE: "REMOVE",
    QUANTITY: "QUANTITY",
    SUBMIT: "SUBMIT",
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: string,
    payload?: CartItemType,
}

//This function is the reducer. It takes the current state and an action, then returns
// a new state based on the action type. It handles adding items, removing items, 
//updating quantity, and clearing the cart.
const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD: {
            //This line checks if the action object has a payload property. 
            //If not, it throws an error. The payload is expected to contain the 
            //details of the item being added to the cart (such as sku, name, price).
            if (!action.payload) {
                throw new Error('action.payload missing in ADD action')
            }
            //This extracts the sku, name, and price from action.payload, 
            //making these values easier to work with in the following code.
            const { sku, name, price } = action.payload

            //This creates a new array, filteredCart, that contains all items from the current cart 
            //(state.cart) except the one being added (identified by sku). 
            //This step ensures that if the item already exists in the cart, it's removed so that it can be 
            //re-added with an updated quantity. This might seem redundant because of the next step but it 
            //ensures that the item, if exists, is added back only once with the correct quantity.
            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            //Searches the current cart for an item with the same sku as the one being added. 
            //If found, itemExists will be that item; otherwise, it will be undefined.
            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            //If the item already exists in the cart (itemExists is not undefined), 
            //its quantity is incremented by 1. If the item does not exist (itemExists is undefined), 
            //the quantity is set to 1, as this is a new addition to the cart.
            const qty: number = itemExists ? itemExists.qty + 1 : 1

            //Constructs a new state object by spreading the previous state (...state) and updating 
            //the cart property. The cart is now an array consisting of the previously filtered cart items 
            //(...filteredCart) and the newly added or updated item ({ sku, name, price, qty }). 
            //This effectively updates the cart by adding the new item or replacing an existing item with 
            //the updated quantity.
            return { ...state, cart: [...filteredCart, { sku, name, price, qty }] }
        }
        case REDUCER_ACTION_TYPE.REMOVE: {
            if (!action.payload) {
                throw new Error('action.payload missing in REMOVE action')
            }

            const { sku } = action.payload

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return { ...state, cart: [...filteredCart] }
        }
        case REDUCER_ACTION_TYPE.QUANTITY: {
            if (!action.payload) {
                throw new Error('action.payload missing in QUANTITY action')
            }

            const { sku, qty } = action.payload

            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            if (!itemExists) {
                throw new Error('Item must exist in order to update quantity')
            }

            const updatedItem: CartItemType = { ...itemExists, qty }

            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku !== sku)

            return { ...state, cart: [...filteredCart, updatedItem] }
        }
        case REDUCER_ACTION_TYPE.SUBMIT: {
            return { ...state, cart: [] }
        }
        default:
            throw new Error('Unidentified reducer action type')
    }
}


//This custom hook uses useReducer to manage the cart's state and 
//useMemo to memorize the action types. It provides functionalities to dispatch 
//actions, calculate total items, calculate total price, and sort items in the cart.
const useCartContext = (initCartState: CartStateType) => {
    const [state, dispatch] = useReducer(reducer, initCartState)

    const REDUCER_ACTIONS = useMemo(() => {
        return REDUCER_ACTION_TYPE
    }, [])

    const totalItems = state.cart.reduce((previousValue, cartItem) => {
        return previousValue + cartItem.qty
    }, 0)

    const totalPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        state.cart.reduce((previousValue, cartItem) => {
            return previousValue + (cartItem.qty * cartItem.price)
        }, 0)
    )

    const cart = state.cart.sort((a, b) => {
        const itemA = Number(a.sku.slice(-4))
        const itemB = Number(b.sku.slice(-4))
        return itemA - itemB
    })

    //Finally, the hook returns an object containing the dispatch function for updating state, 
    //the memoized REDUCER_ACTIONS, and the computed values totalItems, totalPrice, and the sorted cart.
    //Components using this hook can use these values to display cart information and interact with the 
    //cart's state by dispatching actions.
    return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart }
}

//ReturnType: A TypeScript utility type that takes a function type and produces its return type.
//typeof useCartContext: This part gets the type of the useCartContext function itself, not its 
//invocation result. TypeScript then infers what the return type of calling useCartContext would be.
//Essentially, this line defines UseCartContextType as the type of the value returned by the useCartContext
// function. This is useful for TypeScript to know what shape the context value will have, including 
//the dispatch method, the REDUCER_ACTIONS, and the state-related properties (totalItems, totalPrice, cart).
export type UseCartContextType = ReturnType<typeof useCartContext>

//This constant defines the initial state of the cart context. It matches the UseCartContextType 
//structure, providing defaults for all properties:
//dispatch: A no-op function (it does nothing). This is a placeholder until the real 
//dispatch function from useReducer within useCartContext becomes available.
//REDUCER_ACTIONS: Set to the static REDUCER_ACTION_TYPE object.
//totalItems and totalPrice: Set to their initial values (0 and empty string, respectively).
//cart: An empty array, indicating an empty shopping cart.
const initCartContextState: UseCartContextType = {
    dispatch: () => { },
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
    cart: [],
}

//Creates a React context for the cart with a default initial state. 
//This context will allow any child component to access the cart state and dispatcher without having to prop drill.
//createContext: This React function creates a Context object. Context is designed to share data that can be 
//considered "global" for a tree of React components, like authenticated user information, themes, or in this case, 
//the shopping cart state.
//<UseCartContextType>: This part specifies the TypeScript type of the context's value, ensuring type safety 
//for the consumers of the context. initCartContextState: The default value for the context, used when a 
//component does not have a matching Provider above it in the component tree.
const CartContext = createContext<UseCartContextType>(initCartContextState)

//Defines a TypeScript type that expects a children prop, which can be a single ReactElement or 
//an array of ReactElements. This is used in the CartProvider component to type its props, allowing it to 
//accept and render child components.
type ChildrenType = { children?: ReactElement | ReactElement[] }


//This functional component is designed to wrap part of your app's component tree where you want 
//the cart context to be available. It uses the CartContext.Provider component to pass down the 
//cart context to all children. The value prop for the provider is set to the return value of 
//useCartContext(initCartState), which is a call to the custom hook that manages the cart state and logic. 
//This effectively makes the cart state and functionality available to any nested child components that use the 
//useContext(CartContext) hook to access it. The {children} part is where CartProvider renders its 
//child components, allowing this provider component to be used as a wrapper around any part of the app's component tree.
export const CartProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <CartContext.Provider value={useCartContext(initCartState)}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext 