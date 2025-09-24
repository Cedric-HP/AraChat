"use client"
import { useCallback, useState, type FC, type ReactNode } from "react";
import "../styles/navbar.scss"
import Link from "next/link";
import LoginRegister from "./LoginRegister";
import useFetch from "../Hook/useFetch";
import type { AppDispatch, RootState } from "../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import changeCurrenteRoomAction from "@/lib/action/UtilitisesActions/changeCurrenteRoomAction";

type IProps = {
  children: ReactNode[] | ReactNode;
};
type SelectData = React.ChangeEvent<HTMLSelectElement>

const Navbar: FC<IProps> = ({ children }) => {

    const {} = useSelector(
        (store: RootState) => store.utilitisesReducer
    )
    const dispatch: AppDispatch = useDispatch()

    // const fetch = useFetch()
    const [logReg, setLogReg] = useState<boolean>(false)

    const handleSelect = useCallback((selectData: SelectData)=>{
        switch(parseInt(selectData.target.value)) {
            case -1:
                dispatch(changeCurrenteRoomAction({id: -1, name: "Général"}))
                break;
            case -2:
                dispatch(changeCurrenteRoomAction({id: -2, name: "IA"}))
                break;
            case -3:
                dispatch(changeCurrenteRoomAction({id: -3, name: "MILF"}))
                break;
            // default:
            //     const resData = fetch.getChannel(parseInt(selectData.target.value))

        }
    },[dispatch])
    
    return (
        <>
            <header>
                <nav>
                    <div>
                        <h1>AraChat</h1>
                    </div>
                    <ul>
                        <Link className="link" href={"/"}>Accueil</Link>
                        <Link className="link" href={"/chat"}>Chat</Link>
                        <select name="channels" id="channels" onChange={handleSelect}>
                            <option value={-1}>General</option>
                            <hr />
                            <option value={-2}>IA</option>
                            <hr />
                            <option value={-3}>MILF</option>
                        </select>
                    </ul>
                    <button onClick={()=>setLogReg((prevstat)=>{
                        return !prevstat
                    })}>Afficher</button>
                </nav>
            </header>
            <main>
                {logReg ?<LoginRegister/> : <></>}
                {children}
            </main>
        </>
    )
}

export default Navbar