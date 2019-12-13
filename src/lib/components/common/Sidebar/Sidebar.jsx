import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Tooltip } from 'antd';
import s from './Sidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import FontAwesome from 'lib/components/common/FontAwesome';

function Sidebar(props) {
  const [sidebar, setSidebar] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [tagStartName, setTagStartName] = useState('');
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [currentTag, setCurrentTag] = useState('');


  let className = classnames(
    s.sidebar,
    props.className
  );
  let level = 1;

  //set initial sidebar data
  useEffect(() => {
    if (props &&
      props.sidebar &&
      props.sidebar.tags.length !== 0 &&
      props.tags
    ) {
      setSidebar(props.sidebar);
      setCurrentTag(props.sidebar.active);
      setTags(props.tags);
      if (props.sidebar.active && props.paths) {
        let tag = props.sidebar.active;
        let replacedTag = tag.replace(/%2B/g, '/');
        replacedTag = replacedTag.replace(/%20/g, ' ');
        setActiveTag(replacedTag);
        let firstPath = (Object.keys(props.paths)[0]).split('/');
        setTagStartName(firstPath[1]);
      }
    }
  }, [props]);

  //To find the current active tag's path
  useEffect(() => {
    if (activeTag && tags) {
      let currentPath = ''
      tags.map((res, index) => {
        let tagName = res.name.replace(/\s+/g, '');
        if (_.startsWith(tagName.toLowerCase(), tagStartName.toLowerCase()) && _.endsWith(res.name, activeTag)) {
          // setCurrentPath(res.name);
          currentPath = res.name;
        }
      });

      //To call the load function
      findTag(currentPath);
    }
  }, [activeTag]);

  //To expand selecting tag data
  function findTag(path) {
    if (path) {
      let count = 0;
      let pathArray = path.split('/');
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
    }
  }


  //Loop that for expand the current selecting tag data
  function findTagValue(data, pathArray, countValue) {
    let count = countValue;
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


  function loadApi(e, tag) {
    if (e !== '') {
      e.preventDefault();
      e.stopPropagation();
    }
    return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', tag))
    // return store.dispatch(OpenAPIActions.load('http://1984d848.ngrok.io/api/logistics1', tag))
  }

  const toggleNode = (tag) => e => {
    e.preventDefault();
    e.stopPropagation();
    let key = ''
    if (tag && tag.hasOwnProperty('key')) {
      key = tag.key
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
        {nodes.map(node => {
          return <li key={node.tag} className={currentTag === node.tag ? s.nodeActive : s.node}>
            <TreeIcon hasChildren={node.nodes.length > 0} opened={node.opened} node={node}></TreeIcon> <span
              className={s.label} onClick={(e) => loadApi(e, node.tag)}> {node.key} </span>
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
        {sidebar && sidebar.tags && sidebar.tags.map(tag => {
          return <li key={tag.tag} className={currentTag === tag.tag ? s.nodeActive : s.node}>
            <TreeIcon hasChildren={tag.nodes.length > 0} opened={tag.opened} node={tag}></TreeIcon>
            <span className={s.label} onClick={(e) => loadApi(e, tag.tag)}> {tag.key} </span>
            {tag.opened ? <ChildNode nodes={tag.nodes} level={level + 1}></ChildNode> : null}
          </li>
        })}
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
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

export default connect(mapStateToProps)(Sidebar);
