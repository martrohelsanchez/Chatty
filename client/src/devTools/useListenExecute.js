import React, { useEffect } from 'react';

function useListenExecute(exec, listenKey) {
    function whatKey(e) {
        if (e.key === listenKey) {
            exec()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', whatKey);

        return () => {
            document.removeEventListener('keydown', whatKey);
        }
    })
}

export default useListenExecute;