import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import ResponseItem from 'lib/components/openapi/ResponseItem';
import s from './Responses.css';
import PropTypes from 'prop-types';
import List from 'lib/components/common/List';

function Responses(props) {
  const className = classnames(s.Responses, props.className);

  const [responses, setResponses] = useState({});
  const [mediaType, setMediaType] = useState([]);
  const [showDefaultResSource, setDefaultResSource] = useState(false);
  const [nestedResponses, setNestedResponses] = useState([]);
  const [responsesType, setResponsesType] = useState('object');
  const [responsesContent, setResponsesContent] = useState('200');
  const [resRef, setResRef] = useState([]);

  let successResponse = '200';
  let noContentResponse = '204';

  useEffect(() => {
    let content = {};
    if (props &&
      (props.responses || props.requestBodies)) {
      let resData = '200';
      if (props.responses) {
        Object.keys(props.responses).map((res, key) => {
          if (key === 0) {
            resData = res;
          }
        });
      }
      setResponsesContent(resData);
      //Check the the response 200 or 204
      if (resData !== noContentResponse) {
        //Check the props value response or request body    
        if (props &&
          props.responses &&
          props.responses[resData] &&
          props.responses[resData].content) {
          content = props.responses[resData].content;
        } else if (props &&
          props.requestBodies &&
          props.requestBodies.content) {
          content = props.requestBodies.content;
        }
        if (Object.keys(content).length > 0) {
          let tempResponse = {};
          let tempMediaType = [];
          Object.keys(content).map((path, index) => {
            let mediaTypeData = path.split(';');
            let value = content[path];
            if (value &&
              value.schema &&
              value.schema.properties
            ) {
              tempResponse = value.schema.properties;
            }
            tempMediaType.push(mediaTypeData[0]);
          });
          setResponses(tempResponse);
          let tempNestedResponses = [];
          let responseDetails = {
            name: 'Main Source',
            responsesData: tempResponse,
          }
          tempNestedResponses.push(responseDetails);
          setNestedResponses(tempNestedResponses);
          setMediaType(tempMediaType);
        }
      }
    }
  }, [props]);

  //To set the ref value to corresponding div
  function setRefValues(refValue) {
    resRef[props.index] = refValue
    setResRef(resRef)
  }

  function onShowDefaultResSource() {
    setDefaultResSource(!showDefaultResSource)
  }

  function renderSourceRes(response) {
    return <div className={s.sourceCodeView}><pre>{JSON.stringify(response, null, 2)}</pre></div>
  }

  //Callback function for nested function
  function nestedFunction(value, index) {
    if (value &&
      value.responsesData
    ) {
      window.scrollTo(0, resRef[index].offsetTop);
      let  responsesData = {
        value: 'No Data'
      };
      Object.keys(value.responsesData).map((data, index) => {
        if (value.responsesData.type && value.responsesData.type === 'array') {
          if (value.responsesData[data] &&
            value.responsesData[data].properties) {
            responsesData = value.responsesData[data].properties;
          }
        } else {
          if (value.responsesData[data] &&
            value.responsesData[data][0] &&
            value.responsesData[data][0].properties) {
            responsesData = value.responsesData[data][0].properties;
          } else if (value.responsesData &&
            value.responsesData.properties) {
            responsesData = value.responsesData.properties;
          } else if (value.responsesData[data][0]) {
            if (!value.responsesData[data][0].properties && 
              value.responsesData.readOnly && 
              value.responsesData.readOnly !== true) {
              responsesData = {
                value: 'No Data'
              };
            }
          }
        }
      });
      let type = value.responsesData.type ? value.responsesData.type : 'object';
      setResponsesType(type);
      setResponses(responsesData);
      let tempNestedResponses = nestedResponses && nestedResponses.length !== 0 ? nestedResponses : [];
      let responseDetails = {
        name: value.name,
        responsesData: value.responsesData,
      }
      tempNestedResponses.push(responseDetails);
      setNestedResponses(tempNestedResponses);
    }
  }

  //Select the particular nested response
  function selectResponse(value) {
    if (value &&
      value.responsesData
    ) {
      let  responsesData = {
        value: 'No Data'
      };
      Object.keys(value.responsesData).map((data, index) => {
        if (value.responsesData.type && value.responsesData.type === 'array') {
          if (value.responsesData[data] &&
            value.responsesData[data].properties) {
            responsesData = value.responsesData[data].properties;
          }
        } else {
          if (value.responsesData[data] &&
            value.responsesData[data][0] &&
            value.responsesData[data][0].properties) {
            responsesData = value.responsesData[data][0].properties;
          } else if (value.responsesData &&
            value.responsesData.properties) {
            responsesData = value.responsesData.properties;
          }
        }
      });
      responsesData = value.name === 'Main Source' ? value.responsesData : responsesData;
      let type = value.responsesData.type ? value.responsesData.type : 'object';
      setResponsesType(type);
      setResponses(responsesData);
      let indexValue = 0;
      nestedResponses.map((res, index) => {
        if (res.name === value.name) {
          indexValue = index;
        }
      });
      let tempNestedResponses = nestedResponses.slice(0, indexValue + 1);
      setNestedResponses(tempNestedResponses);
    }
  }


  const create = (responsesData) =>
    <ResponseItem responsesData={responses[responsesData]}
      name={responsesData} nestedFunction={nestedFunction} index={props.index} />;

  const mediaTypeCreate = (responsesData) => <div className={s.listOuter}>{responsesData}</div>;

  let responsesRef = null;
  const nestedLink = (responsesValue, index) =>
    <div ref={refValue => setRefValues(refValue)}>
      {nestedResponses.length === index + 1 ?
        <div className={s.NestedFunctionText}>
          {responsesValue.name}
        </div>
        :
        <div className={s.NestedFunctionView}>
          <div className={s.NestedFunction} onClick={() => selectResponse(responsesValue)}>
            {responsesValue.name}
          </div>
          <div className={s.NestedFunctionText}>
            >
        </div>
        </div>
      }
    </div>;

  return (
    <div className={className}>
      {responses && Object.keys(responses).length > 0 ?
        <div>
          <div>
            <Heading level="h1" className={s.responseHeader}>{props.requestBodies ? 'Request body' : 'Response'}</Heading>
            <Heading level="h5" className={s.responseDesc}>Supported Media Types</Heading>
          </div>

          {/* Show mediaType */}
          <div className={s.mediaModal}>
            {mediaType && mediaType.map(mediaTypeCreate)}
          </div>

          <Heading level="h3" className={s.defaultHeader}>Default Response</Heading>
          <Heading level="h5" className={s.defaultdesc}>The following table describes the default response for this task.</Heading>

          {nestedResponses && nestedResponses.length > 0 &&
            <div className={s.NestedFunctionView}>
              <Heading level="h3" className={s.responseDesc}>Body(</Heading> {nestedResponses && nestedResponses.map(nestedLink)} <Heading level="h3" className={s.responseDesc}>)</Heading>
            </div>
          }
          <div className={s.responseType}>Type: {' '}<span className={s.textStyleSmall}>{responsesType}</span></div>

          {/* Show the responsedetails */}
          <div>
            {responses.value && responses.value === 'No Data' ?
              <div><Heading level="h5" className={s.defaultdesc}>No data available</Heading></div>
              :
              <div>
                <div className={s.sourceView} onClick={() => onShowDefaultResSource()}>
                  {showDefaultResSource === false ?
                    <a className={s.sourceTitle}>Show Source</a> : <a className={s.sourceTitle}>Hide Source</a>
                  }
                </div>
                {showDefaultResSource === false ?
                  <div className={s.listModal}>{Object.keys(responses).map(create)}</div>
                  :
                  renderSourceRes(responses)
                }
              </div>
            }
          </div>
        </div>
        :
        <div>
          {responsesContent === '204' &&
            <div>
              <Heading level="h1" className={s.responseHeader}>Response</Heading>
              <Heading level="h3" className={s.responseDesc}>204 Response</Heading>
              <Heading level="h5" className={s.defaultHeader}>No content. This task does not return elements in the response body.</Heading>
            </div>
          }
        </div>
      }
    </div>
  );
}
Responses.propTypes = {
  parameters: PropTypes.array
};


export default Responses;
