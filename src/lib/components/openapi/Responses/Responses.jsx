import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import ResponseItem from 'lib/components/openapi/ResponseItem';
import s from './Responses.css';
import PropTypes from 'prop-types';
import List from 'lib/components/common/List';


function Responses(props) {
  const className = classnames(s.Responses, props.className);

  const [responses, setResponses] = useState([]);
  const [mediaType, setMediaType] = useState([]);
  const [showDefaultResSource, setDefaultResSource] = useState(false);
  const [nestedResponses, setNestedResponses] = useState([]);

  let successResponse = '200';

  useEffect(() => {
    if (props &&
      props.responses &&
      props.responses[successResponse] &&
      props.responses[successResponse].content
    ) {
      let tempResponse = {};
      let tempMediaType = [];
      Object.keys(props.responses[successResponse].content).map((path, index) => {
        let mediaTypeData = path.split(';');
        let value = props.responses[successResponse].content[path];
        if (value &&
          value.schema &&
          value.schema.properties
        ) {
          tempResponse = value.schema.properties;
        }
        tempMediaType.push(mediaTypeData[0]);
      });
      setResponses(tempResponse);
      setMediaType(tempMediaType);
    }
  }, [props]);


  function onShowDefaultResSource() {
    setDefaultResSource(!showDefaultResSource)
  }

  function renderSourceRes(response) {
    return <div><pre>{JSON.stringify(response, null, 2)}</pre></div>
  }

  //Callback function for nested function
  function nestedFunction(value) {
    if (value &&
      value.responsesData
    ) {
      let responsesData = {}
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
              let properties = value.responsesData[data][0].properties;
           responsesData = value.responsesData[data][0].properties;
            }
        }
      });
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
      let responsesData = {}
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
              let properties = value.responsesData[data][0].properties;
           responsesData = value.responsesData[data][0].properties;
            }
        }
      });
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
      name={responsesData} nestedFunction={nestedFunction} />;

  const mediaTypeCreate = (responsesData) => <List>{responsesData}</List>;

  const nestedLink = (responsesValue, index) =>
    <div>
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
      {responses && Object.keys(responses).length !== 0 &&
        <div>
          <Heading level="h3">Responses</Heading>
          <Heading level="h5">Supported Media Types</Heading>
        </div>
      }

      {/* Show mediaType */}
      {mediaType && mediaType.map(mediaTypeCreate)}

      <Heading level="h3">Default Response</Heading>
      <Heading level="h5">The following table describes the default response for this task.</Heading>

      {nestedResponses && nestedResponses.length > 0 &&
        <div className={s.NestedFunctionView}>
          <Heading level="h3">Body(</Heading> {nestedResponses && nestedResponses.map(nestedLink)} <Heading level="h3">)</Heading>
        </div>
      }

      {/* Show the responsedetails */}
      <div>
        <div onClick={() => onShowDefaultResSource()}>
          {showDefaultResSource === false ?
            <a>Show Source</a> : <a>Hide Source</a>
          }
        </div>
        {showDefaultResSource === false ?
          <div>{Object.keys(responses).map(create)}</div>
          :
          renderSourceRes(responses)
        }
      </div>
    </div>
  );
}
Responses.propTypes = {
  parameters: PropTypes.array
};


export default Responses;
