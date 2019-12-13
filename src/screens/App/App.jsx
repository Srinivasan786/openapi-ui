import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import _ from 'lodash';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import OpenAPI from 'lib/components/openapi/OpenAPI';
import ParentPath from 'lib/components/openapi/ParentPath';
import SidebarIcons from 'lib/components/common/SidebarIcons';
import Sidebar from 'lib/components/common/Sidebar';
import ScrollToTop from 'lib/components/common/ScrollToTop';
import PreviousNextButton from 'lib/components/common/PreviousNextButton';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import PropTypes from 'prop-types'
import s from './App.css';




function App(props) {
  const { isLoading } = props;

  const [sidebarHide, setSidebarHide] = useState(true);
  const [sideBarNode, setSideBarNode] = useState('');
  const [pathArray, setPathArray] = useState([]);
  const [consolidateTagArray, setConsolidateTagArray] = useState([]);
  const [tagArray, setTagArray] = useState([]);
  const [paths, setPaths] = useState({});
  const [tagTitle, setTagTitle] = useState('');
  const [subCategory, setSubCategory] = useState([]);
  const [scrollTopHide, setScrollTopHide] = useState(false);


  useEffect(() => {
    if (props && props.paths && props.sidebar) {
      setPaths(props.paths);
      if (props.sidebar.active === null &&
        props.sidebar.tags.length > 0 &&
        isLoading === false) {
        let tag = props.sidebar.tags[0].tag;
        loadApi(tag);
      }
    }
  }, [props]);

  // To call load function
  function loadApi(tag) {
    if (tag) {
      return store.dispatch(OpenAPIActions.load('http://localhost:4000/api/logistics1', tag));
      // return store.dispatch(OpenAPIActions.load('http://1984d848.ngrok.io/api/logistics1', tag));
    }
  }

  useEffect(() => {
    if (paths && Object.keys(paths).length > 0) {
      let tempPathData = [];
      Object.keys(paths).map((res, index) => {
        tempPathData.push(res);
      });
      if (tempPathData[0]) {
        let path = tempPathData[0];
        let pathData = path.split('/');
        let pathValues = [];
        pathData.map((res) => {
          if (res && !_.startsWith(res, '{')) {
            pathValues.push(res);
          }
        });
        setPathArray(pathValues);
      }
    }

  }, [paths]);

  //To find the current selecting path data
  useEffect(() => {
    if (props.sidebar) {
      props.sidebar.tags.map((res, index) => {
        if (res.tag === props.sidebar.active) {
          setConsolidateTagArray(res.nodes);
          setTagTitle(res.key);
        } else if (res.nodes.length > 0) {
          findPathValue(res.nodes);
        }
      });
    }

  }, [props.sidebar]);

  //Loop that for find the current selecting path data
  function findPathValue(data) {
    data.map((res, index) => {
      if (res.tag === props.sidebar.active) {
        setConsolidateTagArray(res.nodes);
        setTagTitle(res.key);
      } else if (res.nodes.length > 0) {
        findPathValue(res.nodes);
      }
    });
  }

  useEffect(() => {
    let tempArray = [];
    let subCategory = [];
    if (consolidateTagArray && consolidateTagArray.length > 0) {
      consolidateTagArray.map((res, index) => {
        if (res.nodes.length <= 0) {
          tempArray.push(res);
        } else {
          subCategory.push(res);
        }
      });
    }
    setTagArray(tempArray);
    setSubCategory(subCategory);
  }, [consolidateTagArray]);

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

  //Get the button
  var mybutton = document.getElementById("myBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.documentElement.scrollTop > 0) {
      setScrollTopHide(true);
    } else {
      setScrollTopHide(false);
    }
  }


  return (
    <div className={s.app}>
      {(isLoading === false && scrollTopHide === true) &&
        <div>
          <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />
        </div>
      }
      <div className={s.SidebarIcons}>
        <SidebarIcons onClickSideBar={onClickSideBar} />
      </div>
      {sidebarHide === true &&
        <div className={s.sidebar}>
          <Sidebar onSideBarChange={onSidebarChange}
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
              <div>
                {tagArray.length > 0 ?
                  <div>
                    <PreviousNextButton
                      activeTag={props.sidebar.active}
                    />
                    <ParentPath
                      info={props.info}
                      paths={paths}
                      tagArray={tagArray}
                      tagTitle={tagTitle}
                      subCategory={subCategory}
                      sidebar={props.sidebar}
                    />
                  </div>
                  :
                  <div>
                    <PreviousNextButton
                      activeTag={props.sidebar.active}
                    />
                    {/* Open API UI */}
                    <OpenAPI
                      info={props.info}
                      servers={props.servers}
                      paths={props.paths}
                      security={props.security}
                      externalDocs={props.externalDocs}
                      tagTitle={tagTitle}
                    />
                  </div>
                }
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
  externalDocs: PropTypes.object,
  sidebar: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    isLoading: OpenAPISelectors.isLoading(state),
    info: OpenAPISelectors.getInfo(state).toJS(),
    servers: OpenAPISelectors.getServers(state).toJS(),
    paths: OpenAPISelectors.getPaths(state).toJS(),
    security: OpenAPISelectors.getSecurity(state).toJS(),
    externalDocs: OpenAPISelectors.getExternalDocs(state).toJS(),
    sidebar: OpenAPISelectors.getSidebar(state).toJS(),
  };
};

export default connect(mapStateToProps)(App);
