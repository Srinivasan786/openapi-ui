import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Menu, Col, Row } from 'antd';
import s from './ModelSidebar.css';
import { connect } from 'react-redux';
import OpenAPISelectors from 'selectors/OpenAPISelectors';

function ModelSidebar(props) {

  let className = classnames(
    s.sidebar,
    props.className
  );
  let level = 1;


  const [components, setComponents] = useState([]);


  useEffect(() => {
    if (props &&
      props.components &&
      props.components.schemas) {
        let components = props.components.schemas;
        let componentsData = [];
        Object.keys(components).map((res, key) => {
          componentsData.push(res);
        })
        setComponents(componentsData.sort())
      }

  },[props.components]);

  //To call the callback function
  function onModelschange(value) {
    if (value && props.onModelschange) {
      props.onModelschange(value)
    }
  }


  return (
    <div className={className}>
      <Col span={24}>
        <ul className={"level1"} id={s.listText}>
        <Menu
        className={"list-menu"}
        mode="inline"
        style={{ width: 330, }}
      >
        {components && components.length > 0 && components.map((res, key) => {
          return(

        <Menu.Item key={key} className={s.textStyle} onClick={() => onModelschange(res)}>
          <div style={{ color: 'black', fontWeight: 'bold'}}>
          {res}
          </div>
          </Menu.Item>
          )
      })
    }
            </Menu>
        </ul>
      </Col>
    </div>
  );
}

ModelSidebar.propTypes = {
  components: PropTypes.object,
};


const mapStateToProps = (state) => {
  return {
    components: OpenAPISelectors.getComponents(state).toJS(),
  };
};

export default connect(mapStateToProps)(ModelSidebar);
