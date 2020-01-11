import { createAction } from 'redux-actions';
import _ from 'lodash';
import refParser from 'json-schema-ref-parser';
import { operationMethods } from 'constants';
import cache from 'memory-cache';

const BASE_URL = 'http://localhost:4000';

let load = createAction('LOAD_SPEC', (tag) => {
    const cachedRes = cache.get(tag);
    if(cachedRes) {
        return Promise.resolve({ spec: cachedRes, tag});
    }

    return refParser.dereference(`${BASE_URL}/api/logistics1` + `/${tag}`).then(result => {

        // We give each operation a uniqueId if not defined.
        _.forEach(result.paths, (pathItem) => {
            operationMethods.forEach(method => {
                let operation = _.get(pathItem, method);
                if (operation && _.isUndefined(operation.operationId)) {
                    operation.operationId = _.uniqueId('operation-');
                }
            });
        });

        cache.put(tag, result);
        return { spec: result, tag };
    });
});

let loadTags = createAction('LOAD_TAGS', () => refParser.dereference(`${BASE_URL}/tags/logistics1`));
let toggleSidebarNav = createAction('TOGGLE_SIDEBAR_NAV', tag => Promise.resolve(tag))

export default {
    load,
    loadTags,
    toggleSidebarNav
};
