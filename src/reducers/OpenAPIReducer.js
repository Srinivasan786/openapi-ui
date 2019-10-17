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
        return state.mergeIn(['spec'], Immutable.fromJS(action.payload));
    },

    'LOAD_SPEC_FAILED': (state, action) => {
        return state.set('errors', action.payload);
    },

    'LOAD_TAGS': (state) => {},
    'LOAD_TAGS_COMPLETED': (state, action) => {
        return state.mergeIn(['sidebar', 'tags'], Immutable.fromJS(action.payload));
    },
    'LOAD_TAGS_FAILED': (state, action) => {
        return state.set('errors', action.payload);
    },
    'TOGGLE_SIDEBAR_NAV_COMPLETED': (state, action) => {
        console.log("Changing toggle state of tag", action.payload);
        let tags = state.getIn(['sidebar', 'tags']).toJS();

        function checkToggle(t) {
            if (t.key === action.payload) {
                t.opened = !t.opened;
            } else if (t.nodes.length > 0) {
                t.nodes.map(checkToggle);
            }
            return t;
        }
        tags = tags.map(checkToggle);
        return state.setIn(['sidebar', 'tags'], Immutable.fromJS(tags));
    }

}, initialState);