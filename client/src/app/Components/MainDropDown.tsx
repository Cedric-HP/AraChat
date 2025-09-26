import displayDropDownAction from "@/lib/action/UtilitisesActions/displayDropDownAction";
import { AppDispatch, RootState } from "@/lib/store";
import { useCallback, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/maindropdown.scss"

const MainDropDown: FC = () => {
    const { dropDown } = useSelector(
        (store: RootState) => store.utilitisesReducer
    )
    const dispatch: AppDispatch = useDispatch()
    return <>
        <div id="main-drop-down">
            <button onClick={useCallback(()=> dispatch(displayDropDownAction(dropDown === "logReg" ? "" : "logReg")),[dispatch, dropDown])}>Se Connecter</button>
        </div>
    </>
};

export default MainDropDown;