import { useRef, useState } from "react"
import {IsUserJustReg} from 'pages/appRoute/AppRoute'

export default () => {
    const ref = useRef<IsUserJustReg>({
        justRegistered: false,
        setIsUserJustReg: null!
    });
    const [isUserJustReg, setIsUserJustReg] = useState(false);

    //Preserve object reference on every rerender
    //To prevent unintentional renders in consumer 
    ref.current.justRegistered = isUserJustReg;
    ref.current.setIsUserJustReg = setIsUserJustReg;

    return ref.current;
}