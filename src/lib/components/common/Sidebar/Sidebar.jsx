import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import s from './Sidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import FontAwesome from 'lib/components/common/FontAwesome';

function Sidebar(props) {
  const [sidebar, setSidebar] = useState([]);

  let className = classnames(
    s.sidebar,
    props.className
  );
  let level = 1;

  if (props.clickedNext !== '' && props.clickedNode !== '') {
    loadApi('', props.clickedNext)
    store.dispatch(OpenAPIActions.toggleSidebarNav(props.clickedNode));
  }

  //set initial sidebar data
  useEffect(() => {
    if (props && props.sidebar && props.sidebar.tags.length !== 0) {
      setSidebar(props.sidebar);
    }
  }, [props]);


  function loadApi(e, tag, type) {
    if (e !== '') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (props && type === 'clicked') {
      let replacedTag = tag.replace(/%2B,%20/g, '/')
      props.onSideBarChange(replacedTag)
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
    const { nodes, level, activeTag } = props;
    if (nodes.length == 0) {
      return null;
    } else {
      return (<ul className={s["level" + level]}>
        {nodes.map(node => {
          return <li key={node.tag} className={activeTag === node.tag ? s.nodeActive : s.node}>
            <TreeIcon hasChildren={node.nodes.length > 0} opened={node.opened} node={node}></TreeIcon> <span
              className={s.label} onClick={(e) => loadApi(e, node.tag, 'clicked')}> {node.key} </span>
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
          if (res.nodes.length !== 0) {
            expandAll(res.nodes);
          }
        } else {
          res.opened = false;
          if (res.nodes.length !== 0) {
            collapseAll(res.nodes);
          }
        }
        return res;
      });

      let sidebarData = {
        active: null,
        tags: sidebarValue
      }
      setSidebar(sidebarData);
    }
  }

  //loop function for set opened true
  function expandAll(data) {
    data.map((res) => {
      res.opened = true;
      if (res.nodes.length !== 0) {
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
      if (res.nodes.length !== 0) {
        collapseAll(res.nodes);
      } else {
        return res;
      }
    });
  }

  return (
    <div className={className}>
      <div className={s.expandAndCollapseView}>
        <i className="fa fa-plus-square" id={s.expandAndCollapseIcon}
          onClick={() => onClickExpandCollapse('Expand')} />
        <i className="fa fa-minus-square" id={s.expandAndCollapseIcon}
          onClick={() => onClickExpandCollapse('Collapse')} />
      </div>
      <ul className={"level1"}>
        {sidebar && sidebar.tags && sidebar.tags.map(tag => {
          return <li key={tag.tag} className={sidebar.active === tag.tag ? s.nodeActive : s.node}>
            <TreeIcon hasChildren={tag.nodes.length > 0} opened={tag.opened} node={tag}></TreeIcon>
            <span className={s.label} onClick={(e) => loadApi(e, tag.tag, 'clicked')}> {tag.key} </span>
            {tag.opened ? <ChildNode nodes={tag.nodes} level={level + 1}
              activeTag={sidebar.active}></ChildNode> : null}
          </li>
        })}
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  sidebar: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    sidebar: OpenAPISelectors.getSidebar(state).toJS(),
  };
};

export default connect(mapStateToProps)(Sidebar);
