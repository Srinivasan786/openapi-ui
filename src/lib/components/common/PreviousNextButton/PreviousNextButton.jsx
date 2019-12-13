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

  const [count, setCount] = useState(0);
  const [activeTag, setActiveTag] = useState('');
  const [tags, setTags] = useState([]);
  const [prevPath, setPrevPath] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [nextPath, setNextPath] = useState('');
  const [tagStartName, setTagStartName] = useState('');

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
      let firstPath = (Object.keys(props.paths)[0]).split('/');
      setTagStartName(firstPath[1]);
    }
  }, [props]);

  //To find the current active tag's path
  useEffect(() => {
    if (activeTag && tags) {
      let currentIndex = 0;
      let prevPathValue = '';
      let nextPathValue = '';
      tags.map((res, index) => {
        let tagName = res.name.replace(/\s+/g, '');
        if (_.startsWith(tagName.toLowerCase(), tagStartName.toLowerCase()) && _.endsWith(res.name, activeTag)) {
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
      findTag(prevPathValue, setPrevPath);
      findTag(nextPathValue, setNextPath);
    }
  }, [activeTag]);


  //To find the current selecting tag data
  function findTag(path, setState) {
    if (path) {
      let count = 0;
      let pathArray = path.split('/');
      props.sidebar.tags.map((res, index) => {
        if (res.key === pathArray[count]) {
          if (count + 1 === pathArray.length) {
            setState(res.tag);
          } else {
            findTagValue(res.nodes, pathArray, count + 1, setState);
          }
        }
      });
    }
  }


  //Loop that for find the current selecting tag data
  function findTagValue(data, pathArray, countValue, setState) {
    let count = countValue;
    data.map((res, index) => {
      if (res.key === pathArray[count]) {
        if (count + 1 === pathArray.length) {
          setState(res.tag);
        } else {
          findTagValue(res.nodes, pathArray, count + 1, setState);
        }
      }
    });
  }

  // To call load function
  function loadApi(e, tag) {
    if (tag) {
      if (e !== '') {
        e.preventDefault();
        e.stopPropagation();
      }

      return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', tag));
      // return store.dispatch(OpenAPIActions.load('http://1984d848.ngrok.io/api/logistics1', tag));
    }
  }

  return (
    <div className={className}>
      <Button.Group size="large">
        <Button
          type="primary"
          disabled={prevPath ? false : true}
          onClick={(e) => loadApi(e, prevPath)}
          className={s.previousButton}
        >
          <Icon type="left" className={s.iconView} />
        </Button>
        <Button
          type="primary"
          disabled={nextPath ? false : true}
          onClick={(e) => loadApi(e, nextPath)}
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
