import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import CommonMark from 'lib/components/common/CommonMark';
import List from 'lib/components/common/List';
import LabelValueListItem from 'lib/components/common/LabelValueListItem';
import s from './ResponseItem.css';
import { Button, Tooltip } from 'antd';


const defaultStyles = {
  query: 'form',
  header: 'simple',
  path: 'simple',
  cookie: 'form'
};


function ResponseItem(props) {
  const [view, setView] = useState(false);
  const className = classnames(s.ResponseItem, props.className);

  let style = props.style || defaultStyles[props.in];

  if (props.description) {
    var description = (
      <LabelValueListItem label="Description">
        <CommonMark>{props.description}</CommonMark>
      </LabelValueListItem>
    );
  }

  if (props.explode) {
    var explode = (
      <LabelValueListItem label="Explode">
        Yes
      </LabelValueListItem>
    );
  }

  if (props.allowReserved) {
    var allowReserved = (
      <LabelValueListItem label="Allow reserved">
        Yes
      </LabelValueListItem>
    );
  }

  function onClickText(value) {
    let key = `${value.name}`;
    if (key !== view) {
      setView(key);
    } else {
      setView('');
    }
  }

  //To call the callback function
  function onClickButton(value) {
    if (props.nestedFunction) {
      props.nestedFunction(value, props.index);
    }
  }

  let type = ''
  let dataType = ''
  if (props && props.responsesData && props.responsesData.type !== undefined) {
    type = props.responsesData.type.charAt(0).toUpperCase(0)
    dataType = props.responsesData.type
  } else {
    type = "O"
    dataType = 'object'
  }

  return (
    <div className={className}>
      <div className={s.listOuter}>
        <List className={s.listConstant}>
          {props.responsesData.description ?
            <div className={s.linkView}>
              <Tooltip placement="bottom" title={dataType}>
              <div className={s.typeStyle}>{type + ' '}
              </div>
              </Tooltip>
              <a className={s.textView}
                onClick={() => onClickText(props)}>
                {/* <span>{props.name + '(optional):' + ' ' + props.responsesData.type}</span> */}
                <span>{props.name}</span>
              </a>
              <div>
                {props.responsesData.type === 'array' &&
                  <Button id={s.buttonStyle} onClick={() => onClickButton(props)}>{props.name}</Button>
                }
              </div>
            </div>
            :
            <div className={s.linkView}>
              <Tooltip placement="bottom" title={dataType}>
              <div className={s.typeStyle}>{type + ' '}</div>
              </Tooltip>
              <div className={s.nameStyle}>{props.name}</div>
              <Button id={s.buttonStyle} onClick={() => onClickButton(props)}>{props.name}</Button>
            </div>
          }
          {view !== `${props.name}` &&
            <div>
              <div className={s.textStyle}>
                {/* <div className={s.textStyleSmall}>{props.name}</div> */}
              </div>
              <div className={s.textStyle}>
                {props.responsesData.description}
              </div>
              {props.explode &&
                <div className={s.textStyle}>
                  Explode: <span className={s.textStyleSmall}>{props.explode}</span>
                </div>
              }
              {props.allowReserved &&
                <div className={s.textStyle}>
                  AllowReserved: <span className={s.textStyleSmall}>{props.allowReserved}</span>
                </div>
              }
            </div>
          }

        </List>
      </div>
    </div>
  );
}


export default ResponseItem;
