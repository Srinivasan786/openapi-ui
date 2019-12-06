import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import List from 'lib/components/common/List';
import Heading from 'lib/components/common/Heading';
import ServerVariable from 'lib/components/openapi/ServerVariable';
import s from './ServerVariables.css';
import PropTypes from 'prop-types'


function ServerVariables(props) {
  if (!props.variables) return null;
  const className = classnames(s.serverVariables, props.className);
  return (
    <div className={className}>
      <Heading level="h3">Variables</Heading>
      <List>
        {
          Object.keys(props.variables).map(name => {
            let variable = props.variables[name];
            return (
              <li key={name}>
                <ServerVariable
                  name={name}
                  enum={_.get(variable, 'enum')}
                  default={_.get(variable, 'default')}
                  description={_.get(variable, 'description')}
                />
              </li>
            );
          })
        }
      </List>
    </div>
  );
}
ServerVariables.propTypes = {
  variables: PropTypes.object
};


export default ServerVariables;
