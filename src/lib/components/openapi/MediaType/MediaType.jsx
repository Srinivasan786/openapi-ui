import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import s from './MediaType.css';


function MediaType(props) {
  const className = classnames(s.mediaType, props.className);

  console.log(props.schema);

  return (
    <div className={className}>
      <Heading level="h6">{props.mediaType}</Heading>
    </div>
  );
}
MediaType.propTypes = {
  mediaType: PropTypes.string.isRequired,
  schema: PropTypes.object,
  examples: PropTypes.array,
  example: PropTypes.object,
  encoding: PropTypes.object
};


export default MediaType;
