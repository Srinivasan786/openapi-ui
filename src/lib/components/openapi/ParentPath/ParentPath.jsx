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
  const [indexPath, setIndexPath] = useState([]);
  const [jumpToData, setJumpToData] = useState({});

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
    if (tagArrayValue && tagArrayValue.length > 0) {
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
            if (subTagValue && subTagValue.length > 0) {
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
    if (totalTagArray && totalTagArray.length > 0) {
      let parantTagPath = [];
      let parentMethodPath = {};
      let pathValue = [];
      totalTagArray.map((res, key) => {
        if (res.methodArray && res.methodArray.length > 0) {
          res.methodArray.map((value, keys) => {
            pathValue.push(value.path);
          });
        }
      });
      Object.keys(paths).map((path, index) => {
        Object.keys(paths[path]).map((pathData, keyValue) => {
          if (paths[path][pathData] &&
            paths[path][pathData].length === undefined &&
            Object.keys(paths[path][pathData]).length > 0) {

            let count = 0;
            if (pathValue && pathValue.length > 0) {
              pathValue.map((res, keyValues) => {
                if (res !== path) {
                  count = count + 1
                }
              });
            }
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
    if (tagArray && tagArray.length > 0) {
      tagArray.map((res, index) => {
        if (_.includes(pathTag, res)) {
          count = count + 1;
        }
      });
    }
    if (count === tagArray.length) {
      return true;
    } else {
      return false;
    }
  }


  function renderItem(data) {
    if (data && data.length > 0) {
      return (
        data.map((res, index) =>
          <div key={index} className={s.listView}  >
            <a className={s.textView}
              onClick={(e) => onClickButton(e, res)}>
              <span>{res.key === props.tagTitle && parentTagCheck === true ? 'API List' : res.key}</span>
            </a>
            {res.key === props.tagTitle && parentTagCheck === true ?
              <div>
                {indexPath && indexPath.length > 0 &&
                  renderIndex()
                }
                {res.path &&
                  <Paths paths={res.path} type='ParentTag' jumpToValue={jumpToData} />
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

  //Display the index
  function renderIndex() {
    if (indexPath && indexPath.length > 0) {
      return (
        indexPath.map((res, index) =>
          <div key={index} className={s.indexView}>
            <div className={s.dot}>
              .
        </div>
            <div className={s.normalTextView}
              onClick={() => jumpToFunction(res)}>
              {res.pathValue}
            </div>
          </div>
        )
      )
    } else {
      return null;
    }
  }

  //To call the jumpToCallback
  function jumpToFunction(pathData) {
    if (pathData) {
      setJumpToData(pathData);
    }
  }

  function renderMethod(data) {
    if (data && data.length > 0) {
      return (
        data.map((res, index) =>
          <div key={index}>
            <ParentPathItem
              methodData={res}
              jumpToValue={jumpToData}
              index={index}
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
      return store.dispatch(OpenAPIActions.load(data.tag));
    } else {
      setParentTagCheck(!parentTagCheck);
    }
  }

  const methods = [
    { key: 'get', value: 'Get' },
    { key: 'post', value: 'Create' },
    { key: 'patch', value: 'Update' },
    { key: 'delete', value: 'Delete' },
    { key: 'put', value: 'Update' }
  ]

  useEffect(() => {
    if (parentTag && parentTag.length > 0 && tagArray && tagArray.length > 0) {
      let data = [];
      //ParenTag
      parentTag.map((path, key) => {
        path.methodArray.map((pathDetails, index) => {
          const methodType = _.filter(methods, function (o) { if (pathDetails.method === o.key) { return o.value; } });
          const types = getSubType(pathDetails.path);
          let method = '';
          if (index === 0) {
            method = methodType[0].value + ' all ' + path.key
          } else {
            method = methodType[0].value + ' ' + path.key + ' by ' + types
          }
          let methodDetails = {
            path: pathDetails.path,
            method: pathDetails.method,
            pathValue: method,
            tagValue: 'ParentTag'
          }
          data.push(methodDetails)
        })
      })
      //TagArray
      tagArray.map((path, key) => {
        if (path.methodArray && path.methodArray.length > 0) {
          path.methodArray.map((pathDetails, index) => {
            const methodType = _.filter(methods, function (o) { if (pathDetails.method === o.key) { return o.value; } });
            const types = getSubType(pathDetails.path);
            const method = methodType[0].value + ' ' + path.key + ' by ' + types
            let methodDetails = {
              path: pathDetails.path,
              method: pathDetails.method,
              pathValue: method
            }
            data.push(methodDetails)
          })
        }
      })
      setIndexPath(_.uniq(data))
    }
  }, [parentTag, tagArray]);

  function getSubType(pathType) {
    const pathValue = pathType.split('/');
    let pathDataTypes = [];
    let dataType = ''
    pathValue.map((data, key) => {
      if (_.startsWith(data, '{')) {
        pathDataTypes.push(_.trim(data, '{}'))
      }
    });
    if (pathDataTypes.length > 0) {
      pathDataTypes.map((data, key) => {
        if (key === pathDataTypes.length - 1 && pathDataTypes.length !== 1) {
          dataType = _.trimEnd(dataType, ', ');
          dataType = dataType + ' and ' + data;
        } else if (pathDataTypes.length > 2) {
          dataType = dataType + data + ', ';
        } else {
          dataType = dataType + data;
        }
      })
    }
    return dataType
  }


  return (
    <div className={className}>
      {/* <Info {...props.info} /> */}
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
