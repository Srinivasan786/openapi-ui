import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import 'font-awesome/css/font-awesome.css';


function FontAwesome(props) {
  const className = classnames('fa', 'fa-' + props.name, props.className);
  const { onClick } = props;
  return (
    <i className={className} onClick={onClick} style={{ color: 'black'}}/>
  );
}
FontAwesome.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func
};


export default FontAwesome;
