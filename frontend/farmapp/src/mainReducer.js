
import { SETVALUE, DECREMENT } from './mainAction';

const initState = {
    value : 178,
    diff : 1
}

function mainReducer(state = initState, actions) 
{
    switch(actions.type){
        case SETVALUE:
            return state = {
                ...state,
                value : actions.intvalue
            };
        case DECREMENT:
            return state = {
                ...state,
                value : state.value - state.diff
            };
        default:
            return state;
    }
}

export default mainReducer;
