import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Tooltip, Col, Row } from 'antd';
import s from './Sidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import FontAwesome from 'lib/components/common/FontAwesome';

function Sidebar(props) {
  const [sidebar, setSidebar] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [currentActiveId, setCurrentActiveId] = useState('');
  const [currentTagArray, setCurrentTagArray] = useState([]);
  const [currentPathValue, setCurrentPathValue] = useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);


  let className = classnames(
    s.sidebar,
    props.className
  );
  let level = 1;

  //set initial sidebar data
  useEffect(() => {
    if (props &&
      props.sidebar &&
      props.sidebar.tags.length > 0 &&
      props.tags &&
      props.isLoading === false
    ) {
      if (props.sidebar !== sidebar) {
        setSidebar(props.sidebar);
      }
      setCurrentTag(props.sidebar.active);
      setTags(props.tags);
      if (props.sidebar.active && props.paths) {
        let tag = props.sidebar.active;
        let replacedTag = tag.replace(/%2B/g, '/');
        replacedTag = replacedTag.replace(/%20/g, ' ');
        setActiveTag(replacedTag);
      }
    }
  }, [props]);

  useEffect(() => {
    if (props.sidebar &&
      props.sidebar.tags &&
      props.sidebar.tags.length > 0
    ) {
      if (currentActiveId === '') {
        setCurrentActiveId(props.sidebar.tags[0].randomId);
        if (props.currentIdSideBar) {
          props.currentIdSideBar(props.sidebar.tags[0].randomId);
        }
      } else if (props.currentTagIdPrevNext && props.currentTagIdPrevNext !== currentActiveId) {
        setCurrentActiveId(props.currentTagIdPrevNext);
        if (props.currentIdSideBar) {
          props.currentIdSideBar(props.currentTagIdPrevNext);
        }
      }
    }
  }, [currentActiveId, props.sidebar, props.currentTagIdPrevNext]);

  useEffect(() => {
    if (currentActiveId) {
      findPath(props.sidebar.tags);
    }
  }, [currentActiveId]);

  function findPath(tagArray) {
    if (tagArray && tagArray.length > 0) {
      tagArray.map((res, index) => {
        if (res.randomId === currentActiveId) {
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
  }

  //Loop that for expand the current selecting tag data
  function findPathValue(tagArray, keyArray) {
    if (tagArray && tagArray.length > 0) {
      tagArray.map((res, index) => {
        if (res.randomId === currentActiveId) {
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
    if (activeTag && currentPathValue && currentPathValue.length > 0 && tags) {
      let currentPath = ''
      tags.map((res, index) => {
        let pathArray = res.name.split('/');
        if (pathArray[0] === currentPathValue[0] &&
          pathArray[pathArray.length - 1] === currentPathValue[currentPathValue.length - 1] &&
          _.endsWith(res.name, activeTag)) {
          currentPath = res.name;
        }
      });

      //To call the load function
      findTag(currentPath);
    }
  }, [currentPathValue, activeTag]);

  //To expand selecting tag data
  function findTag(path) {
    if (path) {
      let count = 0;
      let pathArray = path.split('/');
      if (sidebar.tags && sidebar.tags.length > 0) {
        sidebar.tags.map((res, index) => {
          if (res.key === pathArray[count]) {
            if (count + 1 === pathArray.length) {
              res.opened = true;
            } else {
              res.opened = true;
              findTagValue(res.nodes, pathArray, count + 1);
            }
          }
          return res;
        });
        setSidebar(sidebar);
        forceUpdate();
      }
    }
  }

  //Loop that for expand the current selecting tag data
  function findTagValue(data, pathArray, countValue) {
    let count = countValue;
    if (data && data.length > 0) {
      data.map((res, index) => {
        if (res.key === pathArray[count]) {
          if (count + 1 === pathArray.length) {
            res.opened = true;
          } else {
            res.opened = true;
            findTagValue(res.nodes, pathArray, count + 1);
          }
        }
      });
    }
  }


  function loadApi(e, value) {
    if (e !== '') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (value) {
      if (props.currentIdSideBar) {
        props.currentIdSideBar(value.randomId);
      }
      return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', value.tag))
      // return store.dispatch(OpenAPIActions.load('http://af34d848.ngrok.io/api/logistics1', value.tag))
    }

  }

  const toggleNode = (tag) => e => {
    e.preventDefault();
    e.stopPropagation();
    let key = ''
    if (tag && tag.hasOwnProperty('randomId')) {
      key = tag.randomId
    } else {
      key = tag
    }
    return store.dispatch(OpenAPIActions.toggleSidebarNav(key));
  }

  function TreeIcon(props) {
    const { opened, hasChildren, node } = props;

    if (!hasChildren) {
      return null;
    }
    if (opened) {
      return <FontAwesome onClick={toggleNode(node)} name="minus" />;
    } else {
      return <FontAwesome onClick={toggleNode(node)} name="plus" />
    }
  }

  function ChildNode(props) {
    const { nodes, level } = props;
    if (nodes.length == 0) {
      return null;
    } else {
      return (<ul className={s["level" + level]}>
        {nodes.map((node, index) => {
          return <li key={node.tag} className={currentActiveId === node.randomId ? s.nodeActive : s.node}>
            <TreeIcon hasChildren={node.nodes.length > 0} opened={node.opened} node={node} key={index}></TreeIcon> <span
              className={s.label} onClick={(e) => loadApi(e, node)}> {node.key} </span>
            {node.opened ? <ChildNode nodes={node.nodes} level={level + 1}></ChildNode> : null}
          </li>
        })}
      </ul>);
    }
  }


  //To expand all/Collapse all
  function onClickExpandCollapse(value) {
    if (sidebar && sidebar.tags) {
      let sidebarValue = sidebar.tags.map((res) => {
        if (value === 'Expand') {
          res.opened = true;
          if (res.nodes.length > 0) {
            expandAll(res.nodes);
          }
        } else {
          res.opened = false;
          if (res.nodes.length > 0) {
            collapseAll(res.nodes);
          }
        }
        return res;
      });

      let sidebarData = {
        active: currentTag,
        tags: sidebarValue
      }
      setSidebar(sidebarData);
    }
  }

  //loop function for set opened true
  function expandAll(data) {
    data.map((res) => {
      res.opened = true;
      if (res.nodes.length > 0) {
        expandAll(res.nodes);
      } else {
        return res;
      }
    });
  }

  //loop function for set opened false
  function collapseAll(data) {
    data.map((res) => {
      res.opened = false;
      if (res.nodes.length > 0) {
        collapseAll(res.nodes);
      } else {
        return res;
      }
    });
  }

  return (
    <div className={className}>
      <Col span={24}>
        <div className={s.expandAndCollapseView}>
          <Tooltip placement="bottom" title={'Expand All'}>
            <i className="fa fa-plus-square" id={s.expandAndCollapseIcon}
              onClick={() => onClickExpandCollapse('Expand')} />
          </Tooltip>
          <Tooltip placement="bottom" title={'Collapse All'}>
            <i className="fa fa-minus-square" id={s.expandAndCollapseIcon}
              onClick={() => onClickExpandCollapse('Collapse')} />
          </Tooltip>
        </div>
        <ul className={"level1"} id={s.listText}>
          {sidebar && sidebar.tags && sidebar.tags.length > 0 && sidebar.tags.map((tag, index) => {
            return <li key={tag.tag} className={currentActiveId === tag.randomId ? s.nodeActive : s.node}>
              <TreeIcon hasChildren={tag.nodes.length > 0} opened={tag.opened} node={tag} key={index}></TreeIcon>
              <span className={s.label} onClick={(e) => loadApi(e, tag)}> {tag.key} </span>
              {tag.opened ? <ChildNode nodes={tag.nodes} level={level + 1}></ChildNode> : null}
            </li>
          })}
        </ul>
      </Col>
    </div>
  );
}

Sidebar.propTypes = {
  tags: PropTypes.array,
  sidebar: PropTypes.object,
  paths: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};


const mapStateToProps = (state) => {
  return {
    tags: OpenAPISelectors.getTags(state).toJS(),
    sidebar: OpenAPISelectors.getSidebar(state).toJS(),
    paths: OpenAPISelectors.getPaths(state).toJS(),
    isLoading: OpenAPISelectors.isLoading(state),
  };
};

export default connect(mapStateToProps)(Sidebar);
