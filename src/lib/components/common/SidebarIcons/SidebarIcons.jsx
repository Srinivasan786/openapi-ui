import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import s from './SidebarIcons.css';
import FontAwesome from 'lib/components/common/FontAwesome';

function SidebarIcons(props) {
  let className = classnames(
    s.sidebar,
    props.className
  );

  //call callback function for Hide/show side bar 
  function onClickBar() {
    props.onClickSideBar();
  }

  return (
    <div className={className}>
      <Tooltip placement="right" title={'Table of contents'}>
        <ul>
          <i onClick={onClickBar} className="fa fa-list" id={s.listIcon} />
        </ul>
      </Tooltip>
    </div >
  );
}

export default SidebarIcons;
