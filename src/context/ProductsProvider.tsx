import { ReactElement, createContext } from "react"

//This TypeScript type definition (ProductType) specifies the shape of 
//product objects in the application. 
//Each product has a sku (stock keeping unit), name, and price.

export type ProductType ={
    sku: string,
    name: string,
    price: number
}

//This line declares an initial state for the products list. 
//It's an empty array, indicating that initially, there are no products loaded. 
//The commented section below it shows an example of how this state could be pre-populated 
//with dummy data for testing or development purposes.


// const initState: ProductType[] = []
const initState: ProductType[] = [
    {
        "sku": "item0001",
        "name": "Widget",
        "price": 9.99
    },
    {
        "sku": "item0002",
        "name": "Premium Widget",
        "price": 19.99
    },
    {
        "sku": "item0003",
        "name": "Deluxe Widget",
        "price": 29.99
    }
]

//This type definition specifies the shape of the context object for products. 
//It contains a single field, products, which is an array of ProductType.
export type UseProductsContextType = {products: ProductType[]}

//This line sets the initial context state, which is an object with a products 
//field initialized as an empty array, aligning with the UseProductsContextType.
const initContextState: UseProductsContextType = {products: []}

//This line creates a React context for products (ProductsContext) with an initial 
//state (initContextState). Context is used to pass data through the component tree 
//without having to pass props down manually at every level.
const ProductsContext= createContext<UseProductsContextType>(initContextState)


//This type definition specifies the props for the ProductProvider component, 
//allowing it to accept one or more React elements as children.
type ChildrenType = {children?: ReactElement | ReactElement[]}

//This line declares the ProductProvider functional component, 
//which accepts children as its props and returns a ReactElement. 
//This component is responsible for fetching product data and providing it to its child components.

export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
    // const [products, setProducts] = useState<ProductType[]>(initState)

    const products: ProductType[] = initState



    //This block is the most crucial part. Here, you're using ProductsContext.
    //Provider which is presumably a Context.Provider created using React.createContext(). 
    //This provider allows any descendant component to subscribe to context changes using 
    //ProductsContext.Consumer or useContext(ProductsContext) hook.The value prop of 
    //ProductsContext.Provider determines what value will be available to the components 
    //in its subtree. In this case, you're providing the products array. This means any 
    //component within the subtree of ProductsProvider can access the products array by 
    //using the appropriate method to consume context.
    return (
        <ProductsContext.Provider value={{ products }}>
            {children}
        </ProductsContext.Provider>
    )

}

export default ProductsContext 