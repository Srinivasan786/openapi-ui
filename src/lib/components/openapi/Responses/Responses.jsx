import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import Heading from 'lib/components/common/Heading';
import ResponseItem from 'lib/components/openapi/ResponseItem';
import s from './Responses.css';
import PropTypes from 'prop-types';
import List from 'lib/components/common/List';

const { TabPane } = Tabs;

function Responses(props) {
  const className = classnames(s.Responses, props.className);

  const [responses, setResponses] = useState({});
  const [mediaType, setMediaType] = useState([]);
  const [showDefaultResSource, setDefaultResSource] = useState(false);
  const [nestedResponses, setNestedResponses] = useState([]);
  const [responsesType, setResponsesType] = useState('object');
  const [responsesContent, setResponsesContent] = useState('200');
  const [resRef, setResRef] = useState([]);
  const [tabsContent, setTabsContent] = useState([]);
  const [content, setContent] = useState({});

  let successResponse = '200';
  let noContentResponse = '204';

  useEffect(() => {
    if (props &&
      (props.responses || props.requestBodies)) {
      if (props.responses) {
        let tabs = [];
        Object.keys(props.responses).map((res, key) => {
          tabs.push(res);
        });
        setTabsContent(tabs);
        resValueSet(0);
      } else {
        responsesDetails();
      }
    }
  }, [props]);

  //To set the response value
  function resValueSet(index) {
    Object.keys(props.responses).map((resData, key) => {
      //Check the the response 200 or 204
      if (parseInt(index) === key) {
        setResponsesContent(resData);
        //Check the props value response or request body    
        responsesDetails(resData)
      }
    })
  }

  //Set response/request body values
  function responsesDetails(resData) {
    let content = {};
    if (props &&
      resData &&
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
      let responsesData = {
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
      let responsesData = {
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


  // Onclick tab(
  function changeTab(key) {
    resValueSet(key);
  };
  const create = (responsesData) =>
    <ResponseItem responsesData={responses[responsesData]}
      name={responsesData} nestedFunction={nestedFunction} key={`${responsesData} ${props.index}`} index={props.index} />;

  const mediaTypeCreate = (responsesData, index) => <div className={s.listOuter} key={index}>{responsesData}</div>;

  let responsesRef = null;
  const nestedLink = (responsesValue, index) =>
    <div ref={refValue => setRefValues(refValue)} key={index}>
      {nestedResponses.length === index + 1 ?
        <div className={s.NestedFunctionText}>
          {responsesValue.name}
        </div>
        :
        <div className={nestedResponses.length > 1 ? s.NestedFunctionView : s.NestedFunctionViewActive}>
          <div className={s.NestedFunction} onClick={() => selectResponse(responsesValue)}>
            {responsesValue.name}
            <span className={s.NestedFunctionText}>
              >
        </span>
          </div>
        </div>
      }
    </div>;

  //Response dta view
  function responseView() {
    return (
      <div>
        {responsesContent !== '204' && responses && Object.keys(responses).length > 0 ?
          <div className={s.responseTypeView}>

            <Heading level="h5" className={s.responseDesc}>Supported Media Types</Heading>

            {/* Show mediaType */}
            <div className={s.mediaModal}>
              {mediaType && mediaType.map(mediaTypeCreate)}
            </div>

            <Heading level="h3" className={s.defaultHeader}>Default Response</Heading>
            <Heading level="h5" className={s.defaultdesc}>The following table describes the default response for this task.</Heading>

            {nestedResponses && nestedResponses.length > 0 &&
              <div className={nestedResponses.length > 1 ? s.NestedFunctionView : s.NestedFunctionViewActive}>
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
              <div className={s.responseTypeView}>
                <Heading level="h3" className={s.responseDesc}>204 Response</Heading>
                <Heading level="h5" className={s.defaultHeader}>No content. This task does not return elements in the response body.</Heading>
              </div>
            }
          </div>
        }
      </div>
    )
  }

  return (
    <div className={className}>
      <Heading level="h1" className={s.responseHeader}>{props.requestBodies ? 'Request body' : 'Response'}</Heading>
      <div className={s.cardContainer} id="border-view">
        {props.requestBodies ?
          responseView()
          :
          <Tabs onChange={(res) => changeTab(res)} type="card">
            {tabsContent && tabsContent.map((res, key) => {
              let styleType = 'successResponse'
              if (parseInt(res) >= 200 && parseInt(res) <= 203) {
                styleType = 'successResponse';
              } else if (parseInt(res) >= 400 && parseInt(res) < 500) {
                styleType = 'normalResponse';
              } else {
                styleType = 'badResponse';
              }
              return (
                <TabPane tab={
                  <div>
                    <div
                      className={styleType === 'successResponse' ?
                        s.successResponse : styleType === 'normalResponse' ?
                          s.normalResponse : s.badResponse}>
                      {res}</div>

                  </div>} key={key}>
                  {responseView()}
                </TabPane>
              )
            })
            }
          </Tabs>
        }
      </div>
    </div>
  );
}
Responses.propTypes = {
  parameters: PropTypes.array
};


export default Responses;
