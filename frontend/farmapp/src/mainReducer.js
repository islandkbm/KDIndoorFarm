
import { INCREMENT, DECREMENT } from './mainAction';

const initState = {
    value : 0,
    diff : 1
}

function mainReducer(state = initState, actions) 
{
    switch(actions.type){
        case INCREMENT:
            return state = {
                ...state,
                value : state.value + state.diff
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
