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

function Operation(props) {
  const className = classnames(s.operation, props.className);
  const [showSource, setShowSource] = useState(false)
  const [showResSource, setResShowSource] = useState(false);
  const [pRef, setPRef] = useState([]);
  const [sRef, setSRef] = useState([]);
  const [rRef, setRRef] = useState([]);
  const [resRef, setResRef] = useState([]);

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

  //To set the ref value to corresponding div
  function setRefValues(refValue, refArray, setState) {
    refArray[props.index] = refValue
    setState(refArray)
  }


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
      {props.parameters &&
        <Menu.Item key="1">
          Request
        </Menu.Item>
      }
      {props.security &&
        <Menu.Item key="2">
          Security
        </Menu.Item>
      }
      {props.requestBody &&
        <Menu.Item key="3">
          Request Body
        </Menu.Item>
      }
      {props.responses &&
        <Menu.Item key="4">
          Response
        </Menu.Item>
      }
    </Menu>
  );

  return (
    <section
      id={props.operationId}
      className={className}
    >
      <div className={s.fullContainar}>
        <header className={headerClassName}>
          <Heading
            className={s.heading}
            level="h4"
          >
            <span className={s.inner}>{props.method}</span>
          </Heading>
          {/* <span className={s.summary}>{props.summary}</span> */}
        </header>

        <CommonMark>{props.description}</CommonMark>
        <div className={s.buttonContainar}>
          <div className={s.pathView}>
            <header>

              <Heading
                className={s.urlView}
                level="h3"
              >
                {props.path}
              </Heading>

              {/* <span className={s.summary}>{props.summary}</span> */}
            </header>
          </div>
          <Dropdown overlay={menu} className={s.jumpButton}>
            <Button style={{ display: 'flex', justifyContent: 'space-between', maxHeight: '40px' }} >
              <span className={s.jumpText}>Jump To </span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </div>
      {
        props.externalDocs &&
        <ExternalDocumentation
          {...props.externalDocs}
          headingLevel="h5"
        />
      }

      {props.parameters &&
        <div ref={refElem => setRefValues(refElem, pRef, setPRef)}>
          <Parameters parameters={props.parameters} />
        </div>
      }
      {props.security &&
        <div ref={refElem => setRefValues(refElem, sRef, setSRef)}>
          <Security
            headingLevel="h5"
            securityRequirements={props.security}
          />
        </div>
      }

      {props.requestBody &&
        <div ref={refElem => setRefValues(refElem, rRef, setRRef)}>
          {/* <RequestBodies requestBodies={requestBody} /> */}
          <Responses requestBodies={props.requestBody} index={props.index} />
        </div>
      }
      {props.responses &&
        <div ref={refElem => setRefValues(refElem, resRef, setResRef)}>
          <Responses responses={props.responses} index={props.index} />
        </div>
      }

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
