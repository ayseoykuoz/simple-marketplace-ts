import { ProductType } from "../context/ProductsProvider"
import { ReducerActionType, ReducerAction } from "../context/CartProvider"
import { ReactElement, memo } from "react"

type PropsType = {
    product: ProductType,
    dispatch: React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS: ReducerActionType,
    inCart: boolean,
}

const Product = ({ product, dispatch, REDUCER_ACTIONS, inCart }: PropsType): ReactElement => {

    const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url).href

    const onAddToCart = () => dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } })

    const itemInCart = inCart ? ' → Item in Cart: ✔️' : null

    const content =
        <article className="product">
            <h3>{product.name}</h3>
            <img src={img} alt={product.name} className="product__img" />
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}{itemInCart}</p>
            <button onClick={onAddToCart}>Add to Cart</button>
        </article>

    return content
}

function areProductsEqual(
    { product: prevProduct, inCart: prevInCart }: PropsType, 
    { product: nextProduct, inCart: nextInCart }: PropsType) 
    {
    return (
        Object.keys(prevProduct).every(key => {
            return prevProduct[key as keyof ProductType] ===
                nextProduct[key as keyof ProductType]
        }) && prevInCart === nextInCart
    )
}

//This line uses React.memo to memoize the Product component. 
//Memoization is a performance optimization technique in React that allows a component 
//to re-render only if its props have changed. The second argument to React.memo is a custom 
//comparison function (areProductsEqual in this case) that defines when the component should re-render.
//Product is the component that you want to memoize. areProductsEqual is the custom comparison function defined 
//earlier, which compares the props of the component. By using React.memo with a custom comparison function, 
//you ensure that the Product component will only re-render if its props or the inCart state change, as 
//determined by the logic in areProductsEqual. This can be useful for optimizing performance in your React 
//application by preventing unnecessary re-renders of the Product component.


const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual)

export default MemoizedProduct