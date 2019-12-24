import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import store from 'store';
import _ from 'lodash';
import Heading from 'lib/components/common/Heading';
import ParentPathItem from 'lib/components/openapi/ParentPathItem';
import Info from 'lib/components/openapi/Info';
import OpenAPIActions from 'actions/OpenAPIActions';
import s from './ParentPath.css';
import PropTypes from 'prop-types';
import Paths from 'lib/components/openapi/Paths';


function ParentPath(props) {
  const className = classnames(s.ParentPath, props.className);
  const [paths, setPaths] = useState({});
  const [tagArrayValue, setTagArrayValue] = useState([]);
  const [subTagValue, setSubTagValue] = useState([]);
  const [tagArray, setTagArray] = useState([]);
  const [subTagArray, setSubTagArray] = useState([]);
  const [totalTagArray, setTotalsubTagArray] = useState([]);
  const [parentTagCheck, setParentTagCheck] = useState(true);
  const [parentTag, setParentTag] = useState({});

  //set tag value and sub tag value
  useEffect(() => {
    if (props &&
      props.paths &&
      props.tagArray &&
      props.subCategory
    ) {
      setPaths(props.paths);
      setTagArrayValue(props.tagArray);
      setSubTagValue(props.subCategory);
    }
  }, [props]);

  useEffect(() => {
    if (tagArrayValue) {
      Object.keys(paths).map((path, index) => {
        Object.keys(paths[path]).map((pathData, keyValue) => {
          if (paths[path][pathData] &&
            paths[path][pathData].length === undefined &&
            Object.keys(paths[path][pathData]).length > 0) {
            let pathTag = (paths[path][pathData].tags[0]).split('/');

            //To get childnode data
            tagArrayValue.map((res, key) => {
              let replacedTag = res.tag.replace(/%2B/g, '/');
              let replacedTagTemp = replacedTag.replace(/%20/g, ' ');
              let tagArrayTemp = replacedTagTemp.split('/');
              if (compareTwoTags(pathTag, tagArrayTemp)) {
                let tagValue = {
                  method: pathData,
                  path: path
                }
                let tagsTempArray = res.methodArray ? res.methodArray : [];
                tagsTempArray.push(tagValue);
                res.methodArray = tagsTempArray;
              }
            });

            //To get without childnode data
            subTagValue.map((res, keys) => {
              let replacedTagSub = res.tag.replace(/%2B/g, '/');
              let replacedTagTempSub = replacedTagSub.replace(/%20/g, ' ');
              let tagArrayTempSub = replacedTagTempSub.split('/');
              if (compareTwoTags(pathTag, tagArrayTempSub)) {
                let tagValue = {
                  method: pathData,
                  path: path
                }
                let subTagsTempArray = res.methodArray ? res.methodArray : [];
                subTagsTempArray.push(tagValue);
                res.methodArray = subTagsTempArray;
              }
            });
          }
        });
      });
      setSubTagArray(subTagValue);
      setTagArray(tagArrayValue);
      let tagValue = tagArrayValue.concat(subTagValue);
      setTotalsubTagArray(tagValue);
    }

  }, [tagArrayValue, subTagValue]);

  useEffect(() => {
    if (totalTagArray) {
      let parantTagPath = [];
      let parentMethodPath = {};
      let pathValue = [];
      totalTagArray.map((res, key) => {
        res.methodArray.map((value, keys) => {
          pathValue.push(value.path);
        });
      });
      Object.keys(paths).map((path, index) => {
        Object.keys(paths[path]).map((pathData, keyValue) => {
          if (paths[path][pathData] &&
            paths[path][pathData].length === undefined &&
            Object.keys(paths[path][pathData]).length > 0) {

            let count = 0
            pathValue.map((res, keyValues) => {
              if (res !== path) {
                count = count + 1
              }
            });
            if (count === pathValue.length) {
              let tagValue = {
                method: pathData,
                path: path
              }
              parentMethodPath[path] = paths[path];
              parantTagPath.push(tagValue);
            }
          }
        });
      });
      let parentPathTemp = {
        key: props.tagTitle,
        methodArray: parantTagPath,
        path: parentMethodPath
      }
      let tempPath = [];
      tempPath.push(parentPathTemp);
      setParentTag(tempPath);
    }

  }, [totalTagArray]);

  function compareTwoTags(pathTag, tagArray) {
    let count = 0;
    tagArray.map((res, index) => {
      if (_.includes(pathTag, res)) {
        count = count + 1;
      }
    });
    if (count === tagArray.length) {
      return true;
    } else {
      return false;
    }
  }


  function renderItem(data) {
    if (data) {
      return (
        data.map((res, index) =>
          <div key={index} className={s.listView}  >
            <a className={s.textView}
              onClick={(e) => onClickButton(e, res)}>
              <span>{res.key}</span>
            </a>
            {res.key === props.tagTitle && parentTagCheck === true ?
              <div>
                {res.path &&
                  <Paths paths={res.path} />
                }
              </div>
              :
              <div>
                {res.methodArray &&
                  res.methodArray.length > 0 &&
                  <div>
                    {renderMethod(res.methodArray)}
                  </div>
                }
              </div>
            }
          </div>
        )
      )
    } else {
      return null;
    }
  }

  function renderMethod(data) {
    if (data) {
      return (
        data.map((res, index) =>
          <div>
            <ParentPathItem
              methodData={res}
            />
          </div>
        )
      )
    } else {
      return null;
    }
  }

  //load the current tag
  function onClickButton(e, data) {
    if (data && data.tag) {
      if (e !== '') {
        e.preventDefault();
        e.stopPropagation();
      }
      return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', data.tag))
      // return store.dispatch(OpenAPIActions.load('http://af34d848.ngrok.io/api/logistics1', data.tag))
    } else {
      setParentTagCheck(!parentTagCheck);
    }
  }

  return (
    <div className={className}>
      <Info {...props.info} />
      <div className={s.pathContent}>
        <Heading
          className={s.pathTitle}
          id="paths"
          level="h2"
        >
          {props.tagTitle}
        </Heading>
        {parentTag && parentTag.length > 0 &&
          renderItem(parentTag)
        }
        {renderItem(tagArray)}
      </div>
    </div>
  );
}
ParentPath.propTypes = {
  paths: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
};


export default ParentPath;
