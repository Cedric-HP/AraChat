"use client";
import type { AppDispatch, RootState } from "../../lib/store";
import { redirect, RedirectType, useSearchParams } from 'next/navigation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSX, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/chat.scss"
import UserHeader from "../Components/UserHeader";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";
import fetchProfileAction from "@/lib/action/fetchProfile";

type ProtoMessage = {
  name: string,
  creatAt: string,
  message: string
}

const userList = [
  {
    name: "Gros Enculer"
  },
  {
    name: "Petit Fils De Pute"
  },
  {
    name: "HOT MILF"
  },
  {
    name: "U SUCK BIG GAYS WITH UR MOM"
  },
  {
    name: "Sauceur de Grosses"
  }
]

const prevMessageList: ProtoMessage[] = [
  {
    name: "Milf Gooner",
    creatAt: "2020/09/23 13:20",
    message: "Bonsoir"
  },
  {
    name: "HOT MILF",
    creatAt: "2020/09/23 13:22",
    message: "ARA ARA"
  },
  {
    name: "Petit Fils De Pute",
    creatAt: "2020/09/23 14:25",
    message: "Allez tous vous faire ENCULEZ!"
  },
  {
    name: "Gros Enculer",
    creatAt: "2020/09/23 15:04",
    message: "Deja fait XD"
  },
  {
    name: "U SUCK BIG GAYS WITH UR MOM",
    creatAt: "2020/09/23 16:54",
    message: "SUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!"
  },
  {
    name: "Sauceur de Grosses",
    creatAt: "2020/09/23 16:55",
    message: "Salyut Concord. Je sauce des grosses ;3 (u know what i mean UwU)."
  }
]

export default function Chat() {

  const { currentRoom, logReg } = useSelector(
    (store: RootState) => store.utilitisesReducer
  )
  const { token, user } = useSelector(
    (store: RootState) => store.auth
  )

  const dispatch: AppDispatch = useDispatch()

  // Redirection

  useEffect(()=>{
    if(token === null) {
      if(!logReg){
        dispatch(displayLogRegAction())
      }
      redirect('/', RedirectType.replace)
    }
    else{
      if (user === null) {
        dispatch(fetchProfileAction())
      }
    }
  },[dispatch, logReg, token, user])

  const roomId  = useSearchParams().get('roomId') || ""
  const [ownerElement, setOwnerElement] = useState<JSX.Element>(<></>)
  const [memberElement, setMemberElement] = useState<JSX.Element[]>([])
  const [messageList, setMessageList] = useState<ProtoMessage[]>(prevMessageList)
  const [messageElement, setMessageElement] = useState<JSX.Element[]>([])

  useEffect(()=>{
    if(roomId !== "") {
      
    }
  },[roomId])

  useEffect(()=>{
    if(user !== null) {
      const ownerSrc = user.name.replace(" ", "_")
    setOwnerElement(
       <UserHeader
        name={user.name}
        src={`https://api.dicebear.com/7.x/rings/svg?seed=${ownerSrc}`}
        height={35}
        width={35}
       />
    )
    }
  },[user])
  useEffect(()=>{
    setMemberElement(
      userList.map((item, index)=>{
        const itemSrc = item.name.replace(" ", "_")
        return (
          <div key={`${index}_${item.name}`}>
            <UserHeader
              name={item.name}
              src={`https://api.dicebear.com/7.x/rings/svg?seed=${itemSrc}`}
              height={35}
              width={35}
              />
              <hr />
          </div>
        )
      })
    )
  },[])

  useEffect(()=>{
    setMessageElement(
      messageList.toReversed().map((item, index)=>{
        const itemSrc = item.name.replace(" ", "_")
        const date = new Date(item.creatAt)
        return (
          <div className="message" key={`${item.creatAt}_${index}`}>
            <UserHeader
              name={item.name}
              src={`https://api.dicebear.com/7.x/rings/svg?seed=${itemSrc}`}
              height={35}
              width={35}
            />
            <p>{item.message}</p>
            <span>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</span>
          </div>
        )
      })
    )
  },[messageList])

  const handleSendMessage = (formData: FormData)=>{
    if (user !== null) {
      setMessageList((prevState)=>{
        const newState = [...prevState]
        newState.push(
          {
            name: user.name ,
            creatAt: String(new Date()),
            message: String(formData.get("message"))
          }
        )
        return newState
      })
    }
  }

  return (
    <section id="chat-section">
      <div id="chat">
        <div id="message-list">
          {messageElement}
        </div>
        <form action={handleSendMessage}>
          <input type="text" name="message" id=""  required placeholder={`Envoyer un message dans ${currentRoom.name}`}/>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <div id="users-channel">
        <h1>{currentRoom.name}</h1>
        <div id="users-list">
          <hr className="big-separator"/>
            {ownerElement}
          <hr className="big-separator"/>
            {memberElement}
        </div>
      </div>
    </section>
  );
}
