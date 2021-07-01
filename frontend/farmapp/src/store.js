import {createStore} from "redux";
import mainReducer from "./mainReducer";


const manistore = createStore(mainReducer);

export default manistore;
