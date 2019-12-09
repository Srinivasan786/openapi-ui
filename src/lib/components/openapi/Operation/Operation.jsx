import React, { useState } from 'react';
import classnames from 'classnames';
import CommonMark from 'lib/components/common/CommonMark';
import Heading from 'lib/components/common/Heading';
import RequestBodies from 'lib/components/openapi/RequestBodies';
import Parameters from 'lib/components/openapi/Parameters';
import Responses from 'lib/components/openapi/Responses';
import Security from 'lib/components/openapi/Security';
import ScrollToTop from 'lib/components/common/ScrollToTop';
import ExternalDocumentation from 'lib/components/openapi/ExternalDocumentation';
import s from './Operation.css';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button, Icon } from 'antd';
import 'antd/dist/antd.css';

const pRef = []
const sRef = []
const rRef = []
const resRef = []

function handleMenuClick(e, index) {
  if (e.key === '1') {
    window.scrollTo(0, pRef[index].offsetTop);
  } else if (e.key === '2') {
    window.scrollTo(0, sRef[index].offsetTop);
  } else if (e.key === '3') {
    window.scrollTo(0, rRef[index].offsetTop);
  } else if (e.key === '4') {
    window.scrollTo(0, resRef[index].offsetTop);
  }
}

function Operation(props) {
  const className = classnames(s.operation, props.className);
  const [showSource, setShowSource] = useState(false)
  const [showResSource, setResShowSource] = useState(false)


  const headerClassName = classnames(s.header, {
    [s.methodGet]: props.method === 'get',
    [s.methodPut]: props.method === 'put',
    [s.methodPost]: props.method === 'post',
    [s.methodDelete]: props.method === 'delete',
    [s.methodOptions]: props.method === 'options',
    [s.methodHead]: props.method === 'head',
    [s.methodPatch]: props.method === 'patch',
    [s.methodTrace]: props.method === 'trace'
  });

  let requestBody = props.requestBody;
  if (!Array.isArray(requestBody)) {
    requestBody = [requestBody];
  }

  const menu = (
    <Menu onClick={(e) => handleMenuClick(e, props.index)}>
      <Menu.Item key="1">
        Request
        </Menu.Item>
      <Menu.Item key="2">
        Security
        </Menu.Item>
      <Menu.Item key="3">
        Request Body
        </Menu.Item>
      <Menu.Item key="4">
        Response
        </Menu.Item>
    </Menu>
  );

  function onShowSource() {
    setShowSource(!showSource)
  }

  function renderSourceParam(parameters) {
    return <div><pre>{JSON.stringify(parameters, null, 2)}</pre></div>
  }

  return (
    <section
      id={props.operationId}
      className={className}
    >
      <header className={headerClassName}>
        <Heading
          className={s.heading}
          level="h4"
        >
          <span className={s.inner}>{props.method}</span>
        </Heading>
        <span className={s.summary}>{props.summary}</span>
      </header>
      <CommonMark>{props.description}</CommonMark>
      <Dropdown overlay={menu}>
        <Button>
          Jump To <Icon type="down" />
        </Button>
      </Dropdown>
      {
        props.externalDocs &&
        <ExternalDocumentation
          {...props.externalDocs}
          headingLevel="h5"
        />
      }

      <div ref={refElem => pRef[props.index] = refElem}>
        <div onClick={() => onShowSource()}>
          {showSource === false ?
            <a>Show Source</a> : <a>Hide Source</a>
          }
        </div>

        {showSource === false ?
          <Parameters parameters={props.parameters} /> :
          renderSourceParam(props.parameters)
        }
      </div>

      <div ref={refElem => sRef[props.index] = refElem}>
        <Security
          headingLevel="h5"
          securityRequirements={props.security}
        />
      </div>

      <div ref={refElem => rRef[props.index] = refElem}>
        <RequestBodies requestBodies={requestBody} />
      </div>

      <div ref={refElem => resRef[props.index] = refElem}>
        <Responses responses={props.responses} />
      </div>

    </section>
  );
}

Operation.propTypes = {
  method: PropTypes.string,
  tags: PropTypes.array,
  summary: PropTypes.string,
  description: PropTypes.string,
  externalDocs: PropTypes.object,
  operationId: PropTypes.string,
  parameters: PropTypes.array,
  requestBody: PropTypes.object,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object,
  deprecated: PropTypes.bool,
  security: PropTypes.object,
  servers: PropTypes.array,
  index: PropTypes.number
};


export default Operation;
