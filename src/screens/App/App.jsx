import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import OpenAPI from 'lib/components/openapi/OpenAPI';
import Sidebar from 'lib/components/common/Sidebar';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import s from './App.css';


function App(props) {
  const { paths } = props;

  return (
    <div className={s.app}>
      <div className={s.sidebar}>
        <Sidebar />
      </div>
      <div className={s.body}>
        {Object.keys(paths).length === 0 ? <h2> Click on sidebar to load section documentation </h2> : <OpenAPI
          info={props.info}
          servers={props.servers}
          paths={props.paths}
          security={props.security}
          externalDocs={props.externalDocs}
        />}
      </div>
    </div>
  );

}
App.propTypes = {
  isLoading: PropTypes.bool,
  info: PropTypes.object.isRequired,
  servers: PropTypes.array,
  paths: PropTypes.object.isRequired,
  security: PropTypes.array,
  externalDocs: PropTypes.object,
};


const mapStateToProps = (state) => {
  return {
    isLoading: OpenAPISelectors.isLoading(state),
    info: OpenAPISelectors.getInfo(state).toJS(),
    servers: OpenAPISelectors.getServers(state).toJS(),
    paths: OpenAPISelectors.getPaths(state).toJS(),
    security: OpenAPISelectors.getSecurity(state).toJS(),
    externalDocs: OpenAPISelectors.getExternalDocs(state).toJS(),
  };
};

export default connect(mapStateToProps)(App);
