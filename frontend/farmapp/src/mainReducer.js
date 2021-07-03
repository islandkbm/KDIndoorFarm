
import { SETVALUE, SETLOGIN } from './mainAction';

const initState = {
    LoginRole : "logout",
    value: 0
    
}
 
function mainReducer(state = initState, actions) 
{
    switch(actions.type){
        case SETVALUE:
            return state = {
                ...state,
                value  : actions.intvalue
            };
        case SETLOGIN:
            return state = {
                ...state,
                LoginRole : actions.LoginRole
            };
        default:
            return state;
    }
}

export default mainReducer;
