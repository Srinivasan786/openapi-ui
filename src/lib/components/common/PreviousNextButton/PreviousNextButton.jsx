import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import s from './PreviousNextButton.css';
import { Button, Icon } from 'antd';
import OpenAPISelectors from "selectors/OpenAPISelectors";
import { connect } from "react-redux";

function PreviousNextButton(props) {

  const [prevNode, setPrevNode] = useState([]);
  const [nextNode, setNextNode] = useState([]);
  const [count, setCount] = useState(0);

  let className = classnames(
    s.PreviousNextButton,
    props.className
  );

  if (props && props.clickedSideBarNode !== '') {
    let obj = props.tags.find(o => o.name === props.clickedSideBarNode);
  }

  //on click prev option
  function onClickPrev() {
    setCount(count - 1)
  }

  //on click next option
  function onClickNext() {
    setCount(count + 1)
  }

  useEffect(() => {
    let replaceString = ''
    if (count >= 0) {
      replaceString = props.tags[count].name.replace(/\//g, "%2B")
      props.onClickedPrevNext(replaceString, props.tags[count].name)
    }
  }, [count]);

  return (
    <div className={className}>
      <Button.Group size="large">
        <Button type="primary" onClick={() => onClickPrev()}>
          <Icon type="left" />
        </Button>
        <Button type="primary" onClick={() => onClickNext()}>
          <Icon type="right" />
        </Button>
      </Button.Group>
    </div>
  );
}

PreviousNextButton.propTypes = {
  tags: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
    tags: OpenAPISelectors.getTags(state).toJS()
  };
};

export default connect(mapStateToProps)(PreviousNextButton);
