import React from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import Parameter from 'lib/components/openapi/Parameter';
import s from './Parameters.css';
import PropTypes from 'prop-types'


function Parameters(props) {
  const className = classnames(s.parameters, props.className);

  const pathParameters = props.parameters.filter(parameter => parameter.in === 'path');
  const queryParameters = props.parameters.filter(parameter => parameter.in === 'query');
  const headerParameters = props.parameters.filter(parameter => parameter.in === 'header');
  const cookieParameters = props.parameters.filter(parameter => parameter.in === 'cookie');

  const create = (parameter) => {

    return <Parameter key={`${parameter.name}${parameter.in}`} {...parameter} />
  };

  return (
    <div className={className}>
      <Heading level="h2">Request</Heading>
      {pathParameters.length > 0 && <Heading level="h3">Path parameters</Heading>}
      {pathParameters.map(create)}

      {queryParameters.length > 0 && <Heading level="h3">Query parameters</Heading>}
      {queryParameters.map(create)}

      {headerParameters.length > 0 && <Heading level="h3">Header parameters</Heading>}
      {headerParameters.map(create)}

      {cookieParameters.length > 0 && <Heading level="h3">Cookie parameters</Heading>}
      {cookieParameters.map(create)}
    </div>
  );
}
Parameters.propTypes = {
  parameters: PropTypes.array
};


export default Parameters;
