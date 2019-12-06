import React from 'react';
import s from './ScrollToTop.css';
import PropTypes from 'prop-types'

const intervalId = 0

function ScrollToTop(props) {
    return (
        <button title='Back to top' className={s.scroll}
                onClick={() => { scrollTop(props); }}>Back to top
        </button>
    );
}

function scrollTop(props) {
    let intervalId = setInterval(scrollStep(props), props.delayInMs);
    intervalId = intervalId;
}

function scrollStep(props) {
    if (window.pageYOffset === 0) {
        clearInterval(intervalId);
    }
    window.scroll(0,0);
}

ScrollToTop.propTypes = {
    scrollStepInPx: PropTypes.string,
    delayInMs: PropTypes.string
};


export default ScrollToTop;
