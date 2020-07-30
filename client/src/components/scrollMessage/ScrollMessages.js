import React from 'react';

function ScrollMessages({children, className}) {

    return (
        <div className={className}>
            {children}
        </div>
    )
}

export default ScrollMessages;