"use client"
import { JSX, useCallback, useEffect, useState, type FC, type ReactNode } from "react";
import "../styles/navbar.scss"
import Link from "next/link";
import LoginRegister from "./LoginRegister";
import type { AppDispatch, RootState } from "../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import changeCurrenteRoomAction from "@/lib/action/UtilitisesActions/changeCurrenteRoomAction";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";
import fetchChannelsListAction from "@/lib/action/fetchChannelsList";
import setStatusToIdleAction from "@/lib/action/setStatusToIdle";
import firstFetchChannelAction from "@/lib/action/UtilitisesActions/firstFetchChannelAction";

type IProps = {
  children: ReactNode[] | ReactNode;
};
type SelectData = React.ChangeEvent<HTMLSelectElement>

const Navbar: FC<IProps> = ({ children }) => {

    const [logRegElement, setLogRegElement] = useState<JSX.Element>(<></>)
    const [channelListElement, setChannelListElement] = useState<JSX.Element[]>([])

    const { token, channelList, status } = useSelector(
        (store: RootState) => store.auth
    )

    const { logReg, firstFetchChannel } = useSelector(
        (store: RootState) => store.utilitisesReducer
    )
    const dispatch: AppDispatch = useDispatch()

    useEffect(()=>{
        if (status === "succeeded" && channelList.length !== 0 && !firstFetchChannel) {
            dispatch(changeCurrenteRoomAction(channelList[0]));
            dispatch(firstFetchChannelAction());
        }
        if(status === "succeeded") {
            setTimeout(()=>{
                dispatch(setStatusToIdleAction())
            },1000)
        }
    },[channelList, dispatch, firstFetchChannel, status])

    const handleSelect = useCallback((selectData: SelectData)=>{
        const selectedData = JSON.parse(selectData.target.value)
        dispatch(changeCurrenteRoomAction(selectedData))
    },[dispatch])

    useEffect(()=>{
        setLogRegElement(logReg ?<LoginRegister/> : <></>)
    },[logReg])

    useEffect(()=>{
        dispatch(fetchChannelsListAction())
    },[dispatch, token])

    useEffect(()=>{
        setChannelListElement(
            channelList.map((item, index)=>{
                return (
                    <option value={JSON.stringify(item)} key={`${index}_${item.name}`}>{item.name}</option> 
                )
            })
        )
    },[channelList])
    
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
                            channelList.length !== 0 ? 
                            <select name="channels" id="channels" onChange={handleSelect}>
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