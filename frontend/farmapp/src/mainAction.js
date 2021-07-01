export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export const actionIncrement = () => {
    return {
        type: INCREMENT
    }
}

export const actionDecrement = () => {
    return {
        type: DECREMENT
    }
}