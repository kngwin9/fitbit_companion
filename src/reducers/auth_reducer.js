import { AUTH_USER, AUTH_ERROR, UNAUTH_USER } from '../actions/types';

const default_state = {
    authenticated: false,
    authError: null,
};

export default function (state = default_state, action) {
    switch ( action.type ){
        case AUTH_USER:
            return { ...state, authenticated: true, authError: null };
        case AUTH_ERROR:
            return { ...state, authenticated: false, authError: action.error };
        case UNAUTH_USER:
            return default_state;
        default:
            return state;
    }
}