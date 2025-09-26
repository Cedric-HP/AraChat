"use client"
import { JSX, useCallback, useEffect, useState, type FC, type ReactNode } from "react";
import "../styles/navbar.scss"
import Link from "next/link";
import LoginRegister from "./LoginRegister";
import type { AppDispatch, RootState } from "../../lib/store";
import { useDispatch, useSelector } from "react-redux";
import displayDropDownAction from "@/lib/action/UtilitisesActions/displayDropDownAction";
import fetchChannelsListAction from "@/lib/action/fetchChannelsList";
import setStatusToIdleAction from "@/lib/action/setStatusToIdle";
import firstFetchChannelAction from "@/lib/action/UtilitisesActions/firstFetchChannelAction";
import fetchChannelsDataAction from "@/lib/action/fetchChannelDataAction";
import UserHeader from "./UserHeader";

type IProps = {
  children: ReactNode[] | ReactNode;
};

const Navbar: FC<IProps> = ({ children }) => {

    const [dropDownElement, setDropDownElement] = useState<JSX.Element>(<></>)
    const [avatarElement, setAvatarElement] = useState<JSX.Element>(<></>)

    const { token, channelList, status, user } = useSelector(
        (store: RootState) => store.auth
    )

    const { dropDown, firstFetchChannel } = useSelector(
        (store: RootState) => store.utilitisesReducer
    )
    const dispatch: AppDispatch = useDispatch()

    useEffect(()=>{
        if (token !== null && status === "succeeded" && channelList.length !== 0 && !firstFetchChannel) {
            dispatch(fetchChannelsDataAction(channelList[0].id));
            dispatch(firstFetchChannelAction());
        }
        if(status === "succeeded") {
            setTimeout(()=>{
                dispatch(setStatusToIdleAction())
            },1000)
        }
    },[channelList, dispatch, firstFetchChannel, status, token])

    useEffect(()=>{
        switch(dropDown) {
            case "logReg":
                setDropDownElement(<LoginRegister/>)
                break;
            case "":
                setDropDownElement(<></>)
        }
    },[dropDown])

    useEffect(()=>{
        if(token !== null) {
            dispatch(fetchChannelsListAction())
        }
    },[dispatch, token])

    useEffect(()=>{
        if (token !== null && user !== null){
            const userSrc = user.name.replace(" ", "_")
            setAvatarElement(
                <button>
                    <UserHeader
                    name={user.name}
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${userSrc}`}
                    height={55}
                    width={55}
                    />
                </button>

            )
        }
    },[token, user])
    
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
                    </ul>
                    {avatarElement}
                    <button onClick={useCallback(()=> dispatch(displayDropDownAction(dropDown === "logReg" ? "" : "logReg")),[dispatch, dropDown])}>Se Connecter</button>
                </nav>
            </header>
            <main>
                {dropDownElement}
                {children}
            </main>
        </>
    )
}

export default Navbar