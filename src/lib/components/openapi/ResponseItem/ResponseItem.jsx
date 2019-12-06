import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import CommonMark from 'lib/components/common/CommonMark';
import List from 'lib/components/common/List';
import LabelValueListItem from 'lib/components/common/LabelValueListItem';
import s from './ResponseItem.css';
import { Button } from 'antd';


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
      props.nestedFunction(value);
    }
  }

  let type = ''
  if (props && props.schema) {
    type = props.schema.type
  } else {
    type = props.type
  }

  return (
    <div className={className}>
      <List>
        {props.responsesData.type ?
          <div className={s.linkView}>
            <a className={s.textView}
              onClick={() => onClickText(props)}>
              <span>{props.name + '(optional)' + ':' + props.responsesData.type}</span>
            </a>
            <div>
              {props.responsesData.type === 'array' &&
                <Button id={s.buttonStyle} onClick={() => onClickButton(props)}>{props.name}</Button>
              }
            </div>
          </div>
          :
          <div>
            {props.responsesData.readOnly === true &&
              <div>
                {props.name + '(optional)' + ':' + 'object'}
                <Button id={s.buttonStyle} onClick={() => onClickButton(props)}>{props.name}</Button>
              </div>
            }
          </div>
        }
        {view === `${props.name}` &&
          <div>
            <LabelValueListItem label="Name">
              {props.name}
            </LabelValueListItem>

            {description}

            {explode}

            {allowReserved}
          </div>
        }

      </List>
    </div>
  );
}


export default ResponseItem;