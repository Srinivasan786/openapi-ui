import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import Info from 'lib/components/openapi/Info';
import Paths from 'lib/components/openapi/Paths';
import Security from 'lib/components/openapi/Security';
import ExternalDocumentation from 'lib/components/openapi/ExternalDocumentation';
import Servers from 'lib/components/openapi/Servers';
import s from './OpenAPI.css';
import PropTypes from 'prop-types'


function OpenAPI(props) {
  const className = classnames(s.openAPI, props.className);
  return (
    <div className={className}>
      {/* <Info {...props.info} /> */}
      {props.externalDocs && !_.isEmpty(props.externalDocs) ? <ExternalDocumentation {...props.externalDocs} /> : null}
      <Security securityRequirements={props.security} />
      <Paths paths={props.paths} tagTitle={props.tagTitle}/>
    </div>
  );
}
OpenAPI.propTypes = {
  info: PropTypes.object.isRequired,
  servers: PropTypes.array,
  paths: PropTypes.object.isRequired,
  security: PropTypes.array,
  externalDocs: PropTypes.object
};


export default OpenAPI;
