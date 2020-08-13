import React, {useRef, useLayoutEffect} from 'react';

function ScrollMessages({children, className, whenChanged, onScroll}) {
    const messagesContainer = useRef(null);
    const prevScrollPos = useRef(null);

    useLayoutEffect(() => {
        const prevFromBottom = getPxFromBottom(prevScrollPos.current);

        if (prevFromBottom < 100) {
            scrollToBottom(messagesContainer.current);
        } else {
            //remain from previous position
            goToPrevPos(messagesContainer.current, prevScrollPos.current)
        }

    }, [...whenChanged]);

    function setPrevPos(e) {
        prevScrollPos.current = {
            scrollTop: e.scrollTop,
            clientHeight: e.clientHeight,
            scrollHeight: e.scrollHeight
        }
    }

    function handleScrolling(e) {
        setPrevPos(messagesContainer.current)
        onScroll(e);
    }

    function getPxFromBottom(e) {
        if (e) {
            return e.scrollHeight - (e.scrollTop + e.clientHeight);
        }
        return 0;
    }
    
    function goToPrevPos(e, prevPos) {
        if (e) {
            e.scrollTop = (e.scrollHeight - prevPos.scrollHeight) + prevPos.scrollTop;
        }
    }

    function scrollToBottom(e) {
        if (e) {
            e.scrollTop = e.scrollHeight;
        }
    }

    return (
        <div 
            className={className}
            ref={messagesContainer}
            onScroll={() => handleScrolling(messagesContainer.current)}
        >
            {children}
        </div>
    )
}

export default ScrollMessages;