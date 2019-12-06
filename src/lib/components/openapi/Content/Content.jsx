import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import MediaType from 'lib/components/openapi/MediaType';
import s from './Content.css';
import Heading from 'lib/components/common/Heading';
import PropTypes from 'prop-types'

function Schema({ schema }) {
  if (!schema) return null;

  return <div>
    <Heading level='h6'>Schema</Heading>
    <Heading level='h6'>Properties</Heading>
    <div>Properties goes here</div>
    <Heading level='h6'>Required Fields</Heading>
    <div>Required fields goes here</div>
  </div>
}

function Content(props) {
  if (!props.content) return null;
  const className = classnames(s.content, props.className);
  return (
    <div className={className}>
      {
        _.map(props.content, (value, key) => {
          return (
            <div key={key}>
              <MediaType
                {...value}
                mediaType={key}
              />
              <Schema schema={value.schema}></Schema>
            </div>
          );
        })
      }
    </div>
  );
}
Content.propTypes = {
  content: PropTypes.object,
};


export default Content;
