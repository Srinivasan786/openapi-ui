import React from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import PathItem from 'lib/components/openapi/PathItem';
import s from './ParentPath.css';
import PropTypes from 'prop-types'


function ParentPath(props) {
  const className = classnames(s.paths, props.className);
  return (
    <section className={className}>
      <Heading
        id="paths"
        level="h2"
      >
        Paths
      </Heading>
      {
        Object.keys(props.paths).map((path, index) => {
          return (
              <div key={path}>
                <PathItem
                  key={path}
                  index={index}
                  {...props.paths[path]}
                  path={path}
                />
              </div>
          );
        })
      }
    </section>
  );
}
ParentPath.propTypes = {
  paths: PropTypes.object.isRequired
};


export default ParentPath;
