import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import PathItem from 'lib/components/openapi/PathItem';
import s from './Paths.css';
import PropTypes from 'prop-types'

const methods = [
  'get',
  'put',
  'post',
  'patch',
  'delete'
]
const methodsValue = [
  { key: 'get', value: 'Get' },
  { key: 'post', value: 'Create' },
  { key: 'patch', value: 'Update' },
  { key: 'delete', value: 'Delete' },
  { key: 'put', value: 'Update' }
]
function Paths(props) {
  const [pathData, setPathData] = useState([]);
  const [indexPath, setIndexPath] = useState([]);
  const [jumpToData, setJumpToData] = useState({});

  //To get the data method
  useEffect(() => {
    if (props.paths && props.type !== 'ParentTag') {
      let data = [];
      Object.keys(props.paths).map((path, index) => {
        Object.keys(props.paths[path]).map((PathItem, key) => {
          if (_.includes(methods, PathItem)) {
            let method = {
              path: path,
              type: PathItem
            }
            data.push(method)
          }
        });
      });
      setPathData(data);
    }
  }, [props.paths])

  useEffect(() => {
    if (pathData && pathData.length > 0) {
      let data = [];
      //PathData
      pathData.map((path, key) => {
        const methodType = _.filter(methodsValue, function (o) { if (path.type === o.key) { return o.value; } });
        const types = getSubType(path.path);
        const method = methodType[0].value + ' ' + props.tagTitle + ' by ' + types
        let methodDetails = {
          path: path.path,
          method: path.method,
          pathValue: method
        }
        data.push(methodDetails)
      })
      setIndexPath(_.uniq(data))
    }
  }, [pathData]);

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

  const className = classnames(s.paths, props.className);
  return (
    <section className={className}>
      <Heading
        id="paths"
        className={s.titleView}
        level="h2"
      >
        {props.tagTitle}
      </Heading>
      {props.type !== 'ParentTag' &&
        <div className={s.apiListText}>API List</div>
      }
      {indexPath && indexPath.length > 0 &&
        renderIndex()
      }
      {
        Object.keys(props.paths).map((path, index) => {
          return (
            <div key={path}>
              <PathItem
                key={path}
                index={index}
                {...props.paths[path]}
                path={path}
                jumpToValue={props.jumpToValue || jumpToData}
              />
            </div>
          );
        })
      }
    </section>
  );
}
Paths.propTypes = {
  paths: PropTypes.object.isRequired
};


export default Paths;
