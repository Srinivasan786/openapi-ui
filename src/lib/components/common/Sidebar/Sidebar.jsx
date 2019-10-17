import React, { PropTypes } from 'react';
import classnames from 'classnames';
import s from './Sidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import FontAwesome from 'lib/components/common/FontAwesome';

const loadApi = (tag) => e => {
  e.preventDefault();
  e.stopPropagation();
  return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', tag))
}

const toggleNode = (tag) => e => {
  console.log("toggling node", tag.key);
  e.preventDefault();
  e.stopPropagation();
  return store.dispatch(OpenAPIActions.toggleSidebarNav(tag.key));
}

function TreeIcon(props) {
  const { opened, hasChildren, node } = props;

  if (!hasChildren) {
    return null;
  }
  if (opened) {
    return <FontAwesome onClick={toggleNode(node)} name="minus" />;
  }
  else {
    return <FontAwesome onClick={toggleNode(node)} name="plus" />
  }
}

function ChildNode(props) {
  const { nodes, level } = props;
  if (nodes.length == 0) {
    return null;
  }
  else {
    return (<ul className={s["level" + level]}>
      {nodes.map(node => {
        return <li key={node.tag} className={s.node}>
          <TreeIcon hasChildren={node.nodes.length > 0} opened={node.opened} node={node}></TreeIcon> <span className={s.label} onClick={loadApi(node.tag)}>  {node.key} ({node.nodes.length}) </span>
          {node.opened ? <ChildNode nodes={node.nodes} level={level + 1}></ChildNode> : null}
        </li>
      })}
    </ul>);
  }
}

function Sidebar(props) {
  let { sidebar } = props;
  let className = classnames(
    s.sidebar,
    props.className
  );
  let level = 1;

  return (
    <div className={className}>
      <h1>API Navigation</h1>
      <ul className={"level1"}>
        {sidebar.tags.map(tag => {
          return <li key={tag.tag} className={s.node}>
            <TreeIcon hasChildren={tag.nodes.length > 0} opened={tag.opened} node={tag}></TreeIcon>
            <span className={s.label} onClick={loadApi(tag.tag)}> {tag.key} ({tag.nodes.length}) </span>
            {tag.opened ? <ChildNode nodes={tag.nodes} level={level + 1}></ChildNode> : null}
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
