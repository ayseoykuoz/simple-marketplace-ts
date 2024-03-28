import { ChangeEvent, ReactNode, useReducer } from "react";

type CounterProps ={
    children: (num: number) => ReactNode
}

const initState = {count: 0, text:''};

const enum REDUCER_ACTION_TYPE{
    INCREMENT,
    DECREMENT,
    NEW_INPUT
}

type ReducerAction = {
    type: REDUCER_ACTION_TYPE,
    payload? : string
}

const reducer = (state: typeof initState, action: ReducerAction): typeof initState =>{
    switch(action.type){
        case REDUCER_ACTION_TYPE.DECREMENT:
            return{...state, count: state.count-1}

        case REDUCER_ACTION_TYPE.INCREMENT:
            return{...state, count: state.count+1}

        case REDUCER_ACTION_TYPE.NEW_INPUT:
            return{...state, text: action.payload?? ''}
        default:
            throw new Error()
    }
}

const Counter = ({children}: CounterProps)=>{

    // const [count, setCount]= useState<number>(1);
    const [state, dispatch] = useReducer(reducer, initState)

    const handleInput = (e:ChangeEvent<HTMLInputElement>)=>{
        dispatch({
            type:REDUCER_ACTION_TYPE.NEW_INPUT,
            payload: e.target.value
        })
    }

    return(<>
    <h1>{children(state.count)}</h1>
    <button onClick={()=> dispatch({type: REDUCER_ACTION_TYPE.INCREMENT})}>+</button>
    <button onClick={()=> dispatch({type: REDUCER_ACTION_TYPE.DECREMENT})}>-</button>
    <input type="text" onChange={handleInput}></input>
    <h2>{state.text}</h2>
    </>)
}

export default Counter