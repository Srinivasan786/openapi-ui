import React, { useState, useEffect } from 'react';
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
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import 'antd/dist/antd.css';

const pRef = []
const sRef = []
const rRef = []
const resRef = []
const options = [
  'Request', 'Security', 'Request Body', 'Response'
]

function Operation(props) {
  const className = classnames(s.operation, props.className);
  const [showSource, setShowSource] = useState(false)
  const [showResSource, setResShowSource] = useState(false);
  const [pRef, setPRef] = useState([]);
  const [sRef, setSRef] = useState([]);
  const [rRef, setRRef] = useState([]);
  const [resRef, setResRef] = useState([]);
  const [pathRef, setPathRef] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState(options);
  const [dropdownValue, setDropdownValue] = useState({ value: 'Jump To', label: 'Jump To' });

  useEffect(() => {
    if (props.jumpToValue) {
      if (props.path === props.jumpToValue.path) {
        window.scrollTo(0, pathRef[props.index].offsetTop);
      }
    }

  }, [props.jumpToValue])

  function handleMenuClick(e, index) {
    setDropdownValue({ value: 'Jump To', label: 'Jump To' });
    if (e.value === 'Request') {
      window.scrollTo(0, pRef[index].offsetTop);
    } else if (e.value === 'Security') {
      window.scrollTo(0, sRef[index].offsetTop);
    } else if (e.value === 'Request Body') {
      window.scrollTo(0, rRef[index].offsetTop);
    } else if (e.value === 'Response') {
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

  useEffect(() => {
    if (props) {
      let data = []
      if (props.parameters) {
        data.push('Request')
      }
      if (props.security) {
        data.push('Security')
      }
      if (props.requestBody) {
        data.push('Request Body')
      }
      if (props.responses) {
        data.push('Response')
      }
      setDropdownOptions(data)
    }

  }, [props])



  return (
    <section
      id={props.operationId}
      className={className}
    >
      <div className={s.fullContainar}
        ref={refElem => setRefValues(refElem, pathRef, setPathRef)}>
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
        <div className={classnames(s.buttonContainar, 'row')}>
          <div className={classnames(s.pathView, 'col-lg-6 col-md-4 col-sm-4')}>
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
          <Dropdown
            className={s.jumpButton}
            options={dropdownOptions}
            onChange={(e) => handleMenuClick(e, props.index)}
            value={dropdownValue}
            placeholder="Jump To" />
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
