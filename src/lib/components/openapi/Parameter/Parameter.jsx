import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import CommonMark from 'lib/components/common/CommonMark';
import List from 'lib/components/common/List';
import LabelValueListItem from 'lib/components/common/LabelValueListItem';
import s from './Parameter.css';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';


const defaultStyles = {
  query: 'form',
  header: 'simple',
  path: 'simple',
  cookie: 'form'
};


function Parameter(props) {
  const [view, setView] = useState(false);
  const className = classnames(s.parameter, props.className);

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

  function onClickButton(value) {
    let key = `${value.name} ${value.in}`;
    if (key !== view) {
      setView(key);
    } else {
      setView('');
    }
  }

  let type = ''
  let dataType = ''
  if (props && props.schema && props.schema.type) {
    type = props.schema.type.charAt(0).toUpperCase(0)
    dataType = props.schema.type
  } else {
    type = props.type
    dataType = props.type
  }

  return (
    <div className={className}>
      <List className={s.listItem}>
        <div className={s.typeSpace}>
        <Tooltip placement="bottom" title={dataType}>
      <div className={s.typeStyle}>{type + ' ' }</div>
      </Tooltip>
       {props.description ?
        <a className={s.textView}
          onClick={() => onClickButton(props)}>
          <span className={s.titleName}>{props.name}</span>          
        </a>
        :
        <span className={s.titleName}>{props.name}</span>  
        }
        </div>
        {view === `${props.name} ${props.in}` &&
          <div>
            <div className={s.textStyle}>
              {props.description}
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
  );
}
Parameter.propTypes = {
  name: PropTypes.string.isRequired,
  in: PropTypes.oneOf(['query', 'header', 'path', 'cookie']).isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  deprecated: PropTypes.bool,
  allowEmptyValue: PropTypes.bool,

  style: PropTypes.oneOf(['matrix', 'label', 'form', 'simple', 'spaceDelimited', 'pipeDelimited', 'deepObject']),
  explode: PropTypes.bool,
  allowReserved: PropTypes.bool,
  schema: PropTypes.object,
  examples: PropTypes.array,
  example: PropTypes.object,

  content: PropTypes.object
};


export default Parameter;
