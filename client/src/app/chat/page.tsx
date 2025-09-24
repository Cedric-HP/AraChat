"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AppDispatch, RootState } from "../../lib/store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextPage } from "next";
import { redirect, RedirectType, useSearchParams } from 'next/navigation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSX, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/chat.scss"
import UserHeader from "../Components/UserHeader";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";

type ProtoMessage = {
  name: string,
  creatAt: string,
  message: string
}

const owner = {
  name: "Milf Gooner"
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
  }
]

const prevMessageList: ProtoMessage[] = [
  {
    name: "Milf Gooner",
    creatAt: "1",
    message: "Bonsoir"
  },
  {
    name: "HOT MILF",
    creatAt: "2",
    message: "ARA ARA"
  },
  {
    name: "Petit Fils De Pute",
    creatAt: "3",
    message: "Allez tous vous faire ENCULEZ!"
  },
  {
    name: "Gros Enculer",
    creatAt: "4",
    message: "Deja fait XD"
  },
  {
    name: "U SUCK BIG GAYS WITH UR MOM",
    creatAt: "5",
    message: "SUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!"
  }
]
const currentUser = {
  name: "Milf Gooner"
}

export default function Home() {

  const { currentRoom, logReg } = useSelector(
    (store: RootState) => store.utilitisesReducer
  )
  const { token } = useSelector(
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
  },[dispatch, logReg, token])

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
    const ownerSrc = owner.name.replace(" ", "_")
    setOwnerElement(
       <UserHeader
        name={owner.name}
        src={`https://api.dicebear.com/7.x/rings/svg?seed=${ownerSrc}`}
        height={35}
        width={35}
       />
    )
  },[])
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
        return (
          <div className="message" key={`${item.creatAt}_${index}`}>
            <UserHeader
              name={item.name}
              src={`https://api.dicebear.com/7.x/rings/svg?seed=${itemSrc}`}
              height={35}
              width={35}
            />
            <p>{item.message}</p>
            <span>{item.creatAt}</span>
          </div>
        )
      })
    )
  },[messageList])

  const handleSendMessage = (formData: FormData)=>{
    setMessageList((prevState)=>{
      const newState = [...prevState]
      newState.push(
        {
          name: currentUser.name ,
          creatAt: String(new Date()),
          message: String(formData.get("message"))
        }
      )
      return newState
    })
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
