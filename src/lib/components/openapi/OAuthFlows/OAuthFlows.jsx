import React from 'react';
import classnames from 'classnames';
import s from './OAuthFlows.css';
import PropTypes from 'prop-types'


function OAuthFlows(props) {
  const className = classnames(s.oAuthFlows, props.className);
  return (
    <div className={className}></div>
  );
}
OAuthFlows.propTypes = {
  implicit: PropTypes.object,
  password: PropTypes.object,
  clientCredentials: PropTypes.object,
  authorizationCod: PropTypes.object
};


export default OAuthFlows;
