import { createAction } from 'redux-actions';
import _ from 'lodash';
import refParser from 'json-schema-ref-parser';
import { operationMethods } from 'constants';

let load = createAction('LOAD_SPEC', (url, tag) => {
    console.log("Loading API section ", tag);
    return refParser.dereference(url + `/${tag}`).then(result => {

        // We give each operation a uniqueId if not defined.
        _.forEach(result.paths, (pathItem) => {
            operationMethods.forEach(method => {
                let operation = _.get(pathItem, method);
                if (operation && _.isUndefined(operation.operationId)) {
                    operation.operationId = _.uniqueId('operation-');
                }
            });
        });
        return result;
    });
});

let loadTags = createAction('LOAD_TAGS', url => {
    return refParser.dereference(url);
});

let toggleSidebarNav = createAction('TOGGLE_SIDEBAR_NAV', tag => Promise.resolve(tag))

export default {
    load,
    loadTags,
    toggleSidebarNav
};