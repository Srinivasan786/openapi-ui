import React, { PropTypes } from 'react';
import classnames from 'classnames';
import s from './Sidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';

const loadApi = (tag) => e => {
  e.preventDefault();
  e.stopPropagation();
  return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', tag))
}


function ChildNode(props) {
  const { nodes, level } = props;
  if (nodes.size == 0) {
    return null;
  }
  else {
    return (<ul>
      {nodes.map(node => {
        return <li onClick={loadApi(node.get('tag'))} key={node.get('tag')}>{node.get('key')} ({node.get('nodes').size})
        <ChildNode nodes={node.get('nodes')} level={level + 1}></ChildNode>
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
      <ul>
        {sidebar.get('tags').map(tag => {
          return <li onClick={loadApi(tag.get('tag'))} key={tag.get('tag')}>{tag.get('key')} ({tag.get('nodes').size})
            <ChildNode nodes={tag.get('nodes')} level={level + 1}></ChildNode>
          </li>
        })}
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  sidebar: PropTypes.object,
};


const mapStateToProps = (state) => {
  return {
    sidebar: OpenAPISelectors.getSidebar(state),
  };
};

export default connect(mapStateToProps)(Sidebar);
