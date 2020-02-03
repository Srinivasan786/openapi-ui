import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import s from './ParentPathItem.css';
import PropTypes from 'prop-types'


function ParentPathItem(props) {
  const className = classnames(s.ParentPathItem, props.className);
  const [style, setStyle] = useState('');
  const [pathRef, setPathRef] = useState([]);

  useEffect(() => {
    if (props.jumpToValue) {
      if (props.methodData.path === props.jumpToValue.path) {
        window.scrollTo(0, pathRef[props.index].offsetTop);
      }
    }

  }, [props.jumpToValue])

  //To set the ref value to corresponding div
  function setRefValues(refValue, refArray, setState) {
    refArray[props.index] = refValue
    setState(refArray)
  }

  useEffect(() => {
    if (props && props.methodData && props.methodData) {
      switch (props.methodData.method) {
        case 'get':
          setStyle(s.get);
          break;
        case 'post':
          setStyle(s.post);
          break;
        case 'delete':
          setStyle(s.delete);
          break;
        case 'patch':
          setStyle(s.patch);
          break;
        default:
          setStyle(s.get);
      }
    }

  }, [props]);


  return (
    <div className={className} ref={refElem => setRefValues(refElem, pathRef, setPathRef)}>
      {props && props.methodData &&
        <div>
          <p>
            <span className={s.methodText}> Method: </span>
            <span className={s.methodView} id={style}>
              {(props.methodData.method).toUpperCase()}
            </span>
          </p>
          <p className={s.pathValue}>
            <span className={s.pathText}> Path: </span>
            <span>{props.methodData.path}</span>
          </p>
        </div>
      }
    </div>
  );
}


export default ParentPathItem;
