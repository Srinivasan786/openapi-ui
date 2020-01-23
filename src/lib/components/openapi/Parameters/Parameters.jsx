import React, { useState, useEffect } from 'react';
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

  const [showDefaultcookie, setDefaultcookie] = useState(false);
  const [showDefaultpath, setDefaultpath] = useState(false);
  const [showDefaultquery, setDefaultquery] = useState(false);
  const [showDefaultheader, setDefaultheader] = useState(false);

  const create = (parameter) => {

    return <Parameter key={`${parameter.name}${parameter.in}`} {...parameter} />
  };

  function onShowDefaultCookie() {
    setDefaultcookie(!showDefaultcookie)
  }

  function onShowDefaultPath() {
    setDefaultpath(!showDefaultpath)
  }

  function onShowDefaultQuery() {
    setDefaultquery(!showDefaultquery)
  }

  function onShowDefaultHeader() {
    setDefaultheader(!showDefaultheader)
  }


  function renderSourceRes(response) {
    return <div className={className}><pre>{JSON.stringify(response, null, 2)}</pre></div>
  }

  return (
    <div id="request-content-view">
      <Heading level="h1" className={s.headingParameter}>Request</Heading>
      {pathParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Path parameters</Heading>
      <div>
        <div className={s.sourceView} onClick={() => onShowDefaultPath()}>
          {showDefaultpath === false ?
            <a className={s.sourceTitle}>Show Source</a> : <a className={s.sourceTitle}>Hide Source</a>
          }
        </div>
        {showDefaultpath === false ?
          <div className={className}>{pathParameters.map(create)}</div>
          :
          renderSourceRes(pathParameters)
        }
      </div>
      {/* <div className={className}>
      </div> */}
      </div>
      }
      {queryParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Query parameters</Heading>
      <div>
        <div className={s.sourceView} onClick={() => onShowDefaultQuery()}>
          {showDefaultquery === false ?
            <a className={s.sourceTitle}>Show Source</a> : <a className={s.sourceTitle}>Hide Source</a>
          }
        </div>
        {showDefaultquery === false ?
          <div className={className}>{queryParameters.map(create)}</div>
          :
          renderSourceRes(queryParameters)
        }
      </div>
      {/* <div className={className}>
      </div> */}
      </div>
      }
      {headerParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Header parameters</Heading>
      <div>
        <div className={s.sourceView} onClick={() => onShowDefaultHeader()}>
          {showDefaultheader === false ?
            <a className={s.sourceTitle}>Show Source</a> : <a className={s.sourceTitle}>Hide Source</a>
          }
        </div>
        {showDefaultheader === false ?
          <div className={className}>{headerParameters.map(create)}</div>
          :
          renderSourceRes(headerParameters)
        }
      </div>
      {/* <div className={className}>
      </div> */}
      </div>
      }
      {cookieParameters.length > 0 &&
      <div>
      <Heading level="h3" className={s.headingParameter}>Cookie parameters</Heading>
      <div>
        <div className={s.sourceView} onClick={() => onShowDefaultCookie()}>
          {showDefaultcookie === false ?
            <a className={s.sourceTitle}>Show Source</a> : <a className={s.sourceTitle}>Hide Source</a>
          }
        </div>
        {showDefaultcookie === false ?
          <div className={className}>{cookieParameters.map(create)}</div>
          :
          renderSourceRes(cookieParameters)
        }
      </div>
      {/* <div className={className}>
      </div> */}
      </div>
      }
      </div>
    
  );
}
Parameters.propTypes = {
  parameters: PropTypes.array
};


export default Parameters;
