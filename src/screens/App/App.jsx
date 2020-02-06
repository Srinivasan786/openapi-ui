import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin, Tabs } from 'antd';
import _ from 'lodash';
import store from 'store';
import OpenAPIActions from 'actions/OpenAPIActions';
import OpenAPI from 'lib/components/openapi/OpenAPI';
import ParentPath from 'lib/components/openapi/ParentPath';
import SidebarIcons from 'lib/components/common/SidebarIcons';
import Sidebar from 'lib/components/common/Sidebar';
import ModelSidebar from 'lib/components/common/ModelSidebar';
import ScrollToTop from 'lib/components/common/ScrollToTop';
import PreviousNextButton from 'lib/components/common/PreviousNextButton';
import OpenAPISelectors from 'selectors/OpenAPISelectors';
import PropTypes from 'prop-types'
import s from './App.css';
import Parameters from '../../lib/components/openapi/Parameters/Parameters';

const { TabPane } = Tabs;



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
  const [mobileWidthView, setMobileWidthView] = useState(false);
  const [currentTagIdSidebar, setCurrentTagIdSidebar] = useState('');
  const [currentTagIdPrevNext, setCurrentTagIdPrevNext] = useState('');
  const [tabs, setTabs] = useState('');
  const [components, setComponents] = useState([]);
  const [modelComponents, setModelComponents] = useState([]);
  const [tabKey, setTabKey] = useState('1');
  const [orderComponents, setOrderComponents] = useState([]);


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
      return store.dispatch(OpenAPIActions.load(tag));
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

  //When the user use mobile view below 767px from the width, hide body view
  const size = useWindowSize();

  let mobileView = false;
  if (size.width <= 550) {
    mobileView = true;
  }
  function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
      if (!isClient) {
        return false;
      }

      function handleResize() {
        setWindowSize(getSize());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
  }

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.documentElement.scrollTop > 0) {
      setScrollTopHide(true);
    } else {
      setScrollTopHide(false);
    }
  }

  //call back function for set current tag's id for sidebar
  function currentIdSideBar(value) {
    if (value) {
      setCurrentTagIdSidebar(value);
    }
  }

  //call back function for set current tag's id for previous next
  function currentIdPrevNext(value) {
    if (value) {
      if (mobileView === true) {
        setCurrentTagIdSidebar(value);
      } else {
        setCurrentTagIdSidebar('');
      }
      setCurrentTagIdPrevNext(value);
    }
  }

  //call back function for mobile view
  function checkView() {
    if (mobileView === true) {
      setMobileWidthView(!mobileWidthView);
    }
  }

  // Onclick tab
  function onModelschange(key) {
    components.map(option => {
      if(key === option.title){
        let modelTab = {
          title: option.title,
          components: option.components
        }
        let tempArr = []
        tempArr.push(modelTab)
        setModelComponents(tempArr)
      }
    })
  };

  useEffect(() => {
    if(components){
      setModelComponents(components[0])
  } 
  }, [components[0]]);

  //Display the Interfaces view
  function interfacesView() {
    return (
      <Sidebar onSideBarChange={onSidebarChange}
        currentIdSideBar={currentIdSideBar}
        currentTagIdPrevNext={currentTagIdPrevNext}
        checkView={checkView}
        mobileView={mobileView}
      />
    )
  }

  useEffect(() => {
    if (props &&
      props.components &&
      props.components.schemas) {
        let components = props.components.schemas;
        let componentsData = [];
        let orderData = [];
        Object.keys(components).map((res, key) => {
          let componentData = {
            title: res,
            components: components[res]
          }
          componentsData.push(componentData);
          orderData.push(res);

        })
        setComponents(_.sortBy(componentsData, ['title', 'components']))
        setOrderComponents(orderData.sort())
      }

  },[props.components]);

    //Display the Models view
    function modelsView() {
      return (
        <ModelSidebar onModelschange={onModelschange}
        />
      )
    }

    function tabChange(value) {
      setTabKey(value)
    }


  return (
    <div className={s.app}>
      {(isLoading === false && scrollTopHide === true) &&
        <div>
          <ScrollToTop scrollStepInPx="50" delayInMs="16.66" />
        </div>
      }
      {mobileView === false &&
        <div className={s.SidebarIcons}>
          <SidebarIcons onClickSideBar={onClickSideBar} />
        </div>
      }
      {sidebarHide === true && (mobileView === false || mobileWidthView === false) &&
        <div className={s.sidebar}>
        <Tabs onChange={(e)=>tabChange(e)} type="card">
          <TabPane tab="Interfaces" key="1">
            {interfacesView()}
          </TabPane>
          <TabPane tab="Models" key="2">
            {modelsView()}
          </TabPane>
        </Tabs>
        </div>
      }
      {(mobileView === false || mobileWidthView === true) && tabKey === '1' &&
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
                        currentIdPrevNext={currentIdPrevNext}
                        currentTagIdSidebar={currentTagIdSidebar}
                        checkView={checkView}
                        mobileView={mobileView}
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
                        currentIdPrevNext={currentIdPrevNext}
                        currentTagIdSidebar={currentTagIdSidebar}
                        checkView={checkView}
                        mobileView={mobileView}
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
      }
      {tabKey === '2' &&
      <div>
     {(mobileView === false || mobileWidthView === true) && 
        <div className={sidebarHide === true ? s.body : s.bodyActive}>
          {isLoading === true ?
            <div className={s.loader}>
              <Spin tip="Loading..." size="large" />
            </div>
            :
            <div>
              {Object.keys(paths).length === 0 ? <h2> Click on sidebar to load section documentation </h2> :
                <div>
                  <Parameters model={modelComponents}></Parameters>
                </div>
              }
            </div>
          }
        </div>
      }
        </div>
      }
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
  sidebar: PropTypes.object,
  components: PropTypes.object,
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
    components: OpenAPISelectors.getComponents(state).toJS(),
  };
};

export default connect(mapStateToProps)(App);
