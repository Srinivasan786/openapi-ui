import { handleActions } from 'redux-actions';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
    isLoading: false,
    spec: {
        openapi: '',
        info: {
            title: '',
            version: ''
        },
        servers: [],
        paths: {},
        security: [],
        tags: [],
        externalDocs: {}
    },
    errors: [],
    sidebar: {
        tags: []
    }
});


export default handleActions({

    'LOAD_SPEC': (state) => {
        return state.set('isLoading', true);
    },

    'LOAD_SPEC_COMPLETED': (state, action) => {
        return initialState.mergeIn(['spec'], Immutable.fromJS(action.payload));
    },

    'LOAD_SPEC_FAILED': (state, action) => {
        return initialState.set('errors', action.payload);
    },

    'LOAD_TAGS': (state) => {},
    'LOAD_TAGS_COMPLETED': (state, action) => {
        return initialState.mergeIn(['sidebar', 'tags'], Immutable.fromJS(action.payload));
    },
    'LOAD_TAGS_FAILED': (state, action) => {
        return initialState.set('errors', action.payload);
    }

}, initialState);