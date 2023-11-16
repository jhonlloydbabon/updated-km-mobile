import { CREATE_NOTIFICATION_SUCCESS, FETCH_NOTIFICATION_FAILED, FETCH_NOTIFICATION_REQUEST, FETCH_NOTIFICATION_SUCCESS,} from '../ActionType';

const reducer = (state={}, action) =>{
    switch(action.type){
        case FETCH_NOTIFICATION_REQUEST:
            return { ...state, loading: true };
        case FETCH_NOTIFICATION_SUCCESS:
            return { ...state, notification:action.payload, loading: false };
        case CREATE_NOTIFICATION_SUCCESS:
            return { ...state, notification:[...state.notification, action.payload], loading: false };
        case FETCH_NOTIFICATION_FAILED:
            return { ...state, error: action.error, loading: false };
        default: return state;
    }
}

export default reducer;