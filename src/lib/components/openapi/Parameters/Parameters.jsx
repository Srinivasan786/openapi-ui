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
    <div style={{marginLeft: 10}}>
      <Heading level="h1" className={s.headingParameter}>Request</Heading>
      {pathParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Path parameters</Heading>
      <div className={className}>
      {pathParameters.map(create)}
      </div>
      </div>
      }
      {queryParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Query parameters</Heading>
      <div className={className}>
      {queryParameters.map(create)}
      </div>
      </div>
      }
      {headerParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Header parameters</Heading>
      <div className={className}>
      {headerParameters.map(create)}
      </div>
      </div>
      }
      {cookieParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Cookie parameters</Heading>
      <div className={className}>
      {cookieParameters.map(create)}
      </div>
      </div>
      }
      </div>
    
  );
}
Parameters.propTypes = {
  parameters: PropTypes.array
};


export default Parameters;
