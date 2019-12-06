import React from 'react';
import classnames from 'classnames';
import s from './OAuthFlow.css';
import PropTypes from 'prop-types'


function OAuthFlow(props) {
  const className = classnames(s.oAuthFlow, props.className);
  return (
    <div className={className}>

    </div>
  );
}
OAuthFlow.propTypes = {
  authorizationUrl: PropTypes.string,
  tokenUrl: PropTypes.string,
  refreshUrl: PropTypes.string,
  scopes: PropTypes.object
};


export default OAuthFlow;
