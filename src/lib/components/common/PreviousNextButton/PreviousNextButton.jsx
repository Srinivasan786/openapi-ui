import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import s from './PreviousNextButton.css';
import { Button, Icon } from 'antd';
import OpenAPISelectors from "selectors/OpenAPISelectors";
import { connect } from "react-redux";

function PreviousNextButton(props) {

  const [activeTag, setActiveTag] = useState('');
  const [tags, setTags] = useState([]);
  const [prevPath, setPrevPath] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [nextPath, setNextPath] = useState('');
  const [prevId, setPrevId] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [nextId, setNextId] = useState('');
  const [currentTagArray, setCurrentTagArray] = useState([]);
  const [currentPathValue, setCurrentPathValue] = useState([]);

  let className = classnames(
    s.PreviousNextButton,
    props.className
  );

  //To set the current active tag
  useEffect(() => {
    if (props &&
      props.sidebar &&
      props.tags &&
      props.paths
    ) {
      let tag = props.sidebar.active;
      let replacedTag = tag.replace(/%2B/g, '/');
      replacedTag = replacedTag.replace(/%20/g, ' ');
      setActiveTag(replacedTag);
      setTags(props.tags);
    }
  }, [props]);

  //set current id
  useEffect(() => {
    if (props.currentTagIdSidebar &&
      props.currentTagIdSidebar !== activeTag
    ) {
      setCurrentId(props.currentTagIdSidebar);
      if (props.currentIdPrevNext) {
        props.currentIdPrevNext(props.currentTagIdSidebar);
      }
    }
  }, [props.currentTagIdSidebar]);


  useEffect(() => {
    if (currentId) {
      findPath(props.sidebar.tags);
    }
  }, [currentId]);

  function findPath(tagArray) {
    let value = tagArray.map((res, index) => {
      if (res.randomId === currentId) {
        let tempArray = [];
        tempArray = res.value ? res.value : []
        tempArray.push(res.key);
        res.value = tempArray;
        setCurrentTagArray(res.value);
      } else if (res.nodes.length > 0) {
        let tempArray = [];
        tempArray = res.value ? res.value : []
        tempArray.push(res.key);
        res.value = tempArray
        findPathValue(res.nodes, res.value)
      }
      return res;
    });
  }

  //Loop that for expand the current selecting tag data
  function findPathValue(tagArray, keyArray) {
    // let keyValueArray = keyArray;
    tagArray.map((res, index) => {
      if (res.randomId === currentId) {
        let tempArray = [];
        tempArray = keyArray ? keyArray : []
        tempArray.push(res.key);
        res.value = tempArray;
        setCurrentTagArray(res.value);
      } else if (res.nodes.length > 0) {
        let tempArray = [];
        tempArray = keyArray ? keyArray : []
        tempArray.push(res.key);
        res.value = tempArray
        findPathValue(res.nodes, res.value)
      }
      return res;
    });
  }

  useEffect(() => {
    if (currentTagArray) {
      let tagArray = activeTag.split('/');
      let indexValue = _.findIndex(currentTagArray, function (o) { return o == tagArray[tagArray.length - 1]; });
      let currentSlicedArray = currentTagArray.slice(0, indexValue + 1);
      setCurrentPathValue(currentSlicedArray);
    }
  }, [currentTagArray, activeTag]);

  //To find the current active tag's path
  useEffect(() => {
    if (currentPathValue && currentPathValue.length > 0 && tags) {
      let currentIndex = 0;
      let prevPathValue = '';
      let nextPathValue = '';
      tags.map((res, index) => {
        let pathArray = res.name.split('/');
        if (pathArray[0] === currentPathValue[0] &&
          pathArray[pathArray.length - 1] === currentPathValue[currentPathValue.length - 1] &&
          _.endsWith(res.name, activeTag)) {
          setCurrentPath(res.name);
          currentIndex = index;
        }
      });
      if (tags[currentIndex - 1]) {
        prevPathValue = tags[currentIndex - 1].name;
      }
      if (tags[currentIndex + 1]) {
        nextPathValue = tags[currentIndex + 1].name;
      }

      //To find the tag values
      findTag(prevPathValue, setPrevPath, setPrevId);
      findTag(nextPathValue, setNextPath, setNextId);
    }
  }, [currentPathValue]);


  //To find the current selecting tag data
  function findTag(path, setState, setId) {
    if (path) {
      let count = 0;
      let pathArray = path.split('/');
      props.sidebar.tags.map((res, index) => {
        if (res.key === pathArray[count]) {
          if (count + 1 === pathArray.length) {
            setState(res.tag);
            setId(res.randomId);
          } else {
            findTagValue(res.nodes, pathArray, count + 1, setState, setId);
          }
        }
      });
    }
  }


  //Loop that for find the current selecting tag data
  function findTagValue(data, pathArray, countValue, setState, setId) {
    let count = countValue;
    data.map((res, index) => {
      if (res.key === pathArray[count]) {
        if (count + 1 === pathArray.length) {
          setState(res.tag);
          setId(res.randomId);
        } else {
          findTagValue(res.nodes, pathArray, count + 1, setState, setId);
        }
      }
    });
  }

  // To call load function
  function loadApi(e, tag, id) {
    if (tag && id) {
      if (props.currentIdPrevNext) {
        props.currentIdPrevNext(id);
      }
      if (e !== '') {
        e.preventDefault();
        e.stopPropagation();
      }

      return store.dispatch(OpenAPIActions.load(tag));
    }
  }

  return (
    <div className={className}>
      <Button.Group size="large">
        <Button
          type="primary"
          disabled={prevPath ? false : true}
          onClick={(e) => loadApi(e, prevPath, prevId)}
          className={s.previousButton}
        >
          <Icon type="left" className={s.iconView} />
        </Button>
        <Button
          type="primary"
          disabled={nextPath ? false : true}
          onClick={(e) => loadApi(e, nextPath, nextId)}
          className={s.nextButton}
        >
          <Icon type="right" className={s.iconView} />
        </Button>
        {/* </div> */}
      </Button.Group>
    </div>
  );
}

PreviousNextButton.propTypes = {
  tags: PropTypes.array,
  sidebar: PropTypes.object,
  paths: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    tags: OpenAPISelectors.getTags(state).toJS(),
    sidebar: OpenAPISelectors.getSidebar(state).toJS(),
    paths: OpenAPISelectors.getPaths(state).toJS()
  };
};

export default connect(mapStateToProps)(PreviousNextButton);
