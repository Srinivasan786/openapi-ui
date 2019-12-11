import React from 'react';
import classnames from 'classnames';
import Heading from 'lib/components/common/Heading';
import RequestBody from 'lib/components/openapi/RequestBody';
import s from './RequestBodies.css';
import PropTypes from 'prop-types'


function RequestBodies(props) {
  if (!props.requestBodies || !props.requestBodies.length) return null;
  const className = classnames(s.requestBodies, props.className);
  return (
    <section className={className}>
      <Heading level="h3" className={s.headingRequest}>Request body</Heading>
      {
        props.requestBodies.map(requestBody => {
          return (
            <RequestBody
              key={Math.random().toString()}
              {...requestBody}
            />
          );
        })
      }
    </section>
  );
}
RequestBodies.propTypes = {
  requestBodies: PropTypes.array
};


export default RequestBodies;
