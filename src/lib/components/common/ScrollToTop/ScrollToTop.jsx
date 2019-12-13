import React from 'react';
import s from './ScrollToTop.css';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';

const intervalId = 0

function ScrollToTop(props) {
    return (
        <Button
            type="primary"
            className={s.topButton}
            onClick={() => scrollTop(props)}>
            <Icon type="up" className={s.iconView} />
        </Button>
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
    window.scroll(0, 0);
}

ScrollToTop.propTypes = {
    scrollStepInPx: PropTypes.string,
    delayInMs: PropTypes.string
};


export default ScrollToTop;
