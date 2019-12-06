import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import OpenAPI from 'lib/components/openapi/OpenAPI';
import SidebarIcons from 'lib/components/common/SidebarIcons';
import Sidebar from 'lib/components/common/Sidebar';
import ScrollToTop from 'lib/components/common/ScrollToTop';
import PreviousNextButton from 'lib/components/common/PreviousNextButton';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import PropTypes from 'prop-types'
import { RedocStandalone } from 'redoc';
import s from './App.css';
import { Spin } from 'antd';



function App(props) {
  const { paths } = props;

  const [sidebarHide, setSidebarHide] = useState(true);
  const [prevNext, setPrevNext] = useState('');
  const [node, setNode] = useState('');
  const [sideBarNode, setSideBarNode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPrevNext('')
  }, [prevNext]);

  useEffect(() => {
    setNode('')
  }, [node]);

  useEffect(() => {
    setSideBarNode('')
  }, [sideBarNode]);

  //callback function for Hide/show side bar
  function onClickSideBar() {
    setSidebarHide(!sidebarHide);
  }

  function onSidebarChange(value) {
    setSideBarNode(value)
  }

  function onClickPrevNext(value, nodeValue) {
    setPrevNext(value)
    setNode(nodeValue)
  }

  return (
    <div className={s.app}>
      <div className={s.SidebarIcons}>
        <SidebarIcons onClickSideBar={onClickSideBar} />
      </div>
      {sidebarHide === true &&
        <div className={s.sidebar}>
          <Sidebar onSideBarChange={onSidebarChange}
            clickedNext={prevNext}
            clickedNode={node}
          />
        </div>
      }
      <div className={sidebarHide === true ? s.body : s.bodyActive}>
        {isLoading === true ?
          <div className={s.loader}>
            <Spin tip="Loading..." size="large" />
          </div>
          :
          <div>
            {Object.keys(paths).length === 0 ? <h2> Click on sidebar to load section documentation </h2> :
              /***Open API UI */

              <div>
                <PreviousNextButton onClickedPrevNext={onClickPrevNext}
                  clickedSideBarNode={sideBarNode}
                />
                <OpenAPI
                  info={props.info}
                  servers={props.servers}
                  paths={props.paths}
                  security={props.security}
                  externalDocs={props.externalDocs}
                />
                <div>
                  <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />
                </div>
              </div>
            }
          </div>
        }
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
  externalDocs: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    isLoading: OpenAPISelectors.isLoading(state),
    info: OpenAPISelectors.getInfo(state).toJS(),
    servers: OpenAPISelectors.getServers(state).toJS(),
    paths: OpenAPISelectors.getPaths(state).toJS(),
    security: OpenAPISelectors.getSecurity(state).toJS(),
    externalDocs: OpenAPISelectors.getExternalDocs(state).toJS()
  };
};

export default connect(mapStateToProps)(App);
