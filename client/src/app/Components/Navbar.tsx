"use client"
import { JSX, useCallback, useEffect, useState, type FC, type ReactNode } from "react";
import "../styles/navbar.scss"
import Link from "next/link";
import LoginRegister from "./LoginRegister";
import type { AppDispatch, RootState } from "../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import changeCurrenteRoomAction from "@/lib/action/UtilitisesActions/changeCurrenteRoomAction";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";
import { Channel } from "@/lib/type/usersChatType";

type IProps = {
  children: ReactNode[] | ReactNode;
};
type SelectData = React.ChangeEvent<HTMLSelectElement>

type BaseChannel = {
    general: Channel,
    ia: Channel,
    milf: Channel
}

const baseChannel: BaseChannel = {
    general: {
        id: 1,
        name: "Général"
    },
    ia: {
        id: 2,
        name: "IA"
    },
    milf: {
        id: 3,
        name: "MILF"
    }
}

const Navbar: FC<IProps> = ({ children }) => {

    const [logRegElement, setLogRegElement] = useState<JSX.Element>(<></>)
    const [channelListElement, setChannelListElement] = useState<JSX.Element[]>([])

    const { token, user } = useSelector(
        (store: RootState) => store.auth
    )

    const { logReg } = useSelector(
        (store: RootState) => store.utilitisesReducer
    )
    const dispatch: AppDispatch = useDispatch()

    const handleSelect = useCallback((selectData: SelectData)=>{
        const selectedData = JSON.parse(selectData.target.value)
        dispatch(changeCurrenteRoomAction({id: selectedData.id , name: selectedData.name}))
    },[dispatch])

    useEffect(()=>{
        setLogRegElement(logReg ?<LoginRegister/> : <></>)
    },[logReg])

    // useEffect(()=>{
    //     if (user !== null) {
    //         setChannelListElement(
    //         user.channelList.map((item, index)=>{
    //             return (
    //                 <option value={JSON.stringify(item)} key={`${index}_${item.name}`}>{item.name}</option> 
    //             )
    //         })
    //     )
    //     }
    // },[user])
    
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
                        {
                            token !== null ? 
                            <select name="channels" id="channels" onChange={handleSelect}>
                                <option value={JSON.stringify(baseChannel.general)}>General</option>
                                <option value={JSON.stringify(baseChannel.ia)}>IA</option>
                                <option value={JSON.stringify(baseChannel.milf)}>MILF</option>
                                {channelListElement}
                            </select>:
                            <></>
                        }
                    </ul>
                    <button onClick={()=> dispatch(displayLogRegAction())}>Afficher</button>
                </nav>
            </header>
            <main>
                {logRegElement}
                {children}
            </main>
        </>
    )
}

export default Navbar