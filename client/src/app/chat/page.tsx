"use client";
import type { AppDispatch, RootState } from "../../lib/store";
import { redirect, RedirectType, useSearchParams } from 'next/navigation'
import { JSX, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/chat.scss"
import UserHeader from "../Components/UserHeader";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";
import fetchProfileAction from "@/lib/action/fetchProfile";
import postMessageAction from "@/lib/action/postMessageAction";
import { Message, ProfilPublic } from "@/lib/type/usersChatType";
import fetchProfileByIdAction from "@/lib/action/fetchProfileById";

export default function Chat() {

  const { logReg } = useSelector(
    (store: RootState) => store.utilitisesReducer
  )
  const { token, user, currentChannelData , usersProfilList} = useSelector(
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
  const [messageElement, setMessageElement] = useState<JSX.Element[]>([])

  useEffect(()=>{
    if(roomId !== "") {
      
    }
  },[roomId])

  // WebSocket Part

  useEffect(()=>{
    const ws = new WebSocket(`ws://localhost:8000/ws/${currentChannelData.id}/${token}`)
    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };
    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    return () => {
      ws.close();
    };
  },[currentChannelData, token])

  const findUserInArray = useCallback((id: number)=> {
      return usersProfilList.find((item)=>item.id === id)
  },[usersProfilList])

  const getUserProfilById = useCallback( async (id: number) =>{
    if(token !== null &&user !== null) {
      if (user.id === id) {
        return user
      }
      const find = findUserInArray(id)
      if (find !== undefined) {
        return find
      }
      await dispatch(fetchProfileByIdAction(id))
      let count = 0
      const interval = setInterval(()=>{
        const findTakeTwo = findUserInArray(id)
        if (findTakeTwo !== undefined) {
          return findTakeTwo
        }
        if (count >= 10) {
          clearInterval(interval)
        }
        count ++
      }, 500) 
    }
  },[dispatch, findUserInArray, token, user])

  const deletedUserData = (id: number)=>{
    const deletedUser: ProfilPublic = {
      id: id,
      name: `deleted_User_${id}`,
      birthdate: "",
      sexe: "NaN"
    }
    return deletedUser
  }

  // Display Owner

  const displayOwner = useCallback(async ()=> {
    if(currentChannelData.owner_id !== null ) {
      let profil = await getUserProfilById(currentChannelData.owner_id)
      if (profil === undefined) {
        profil = deletedUserData(currentChannelData.owner_id)
      }
      const ownerSrc = profil.name.replace(" ", "_")
      setOwnerElement(
        <>
          <UserHeader
          name={profil.name}
          src={`https://api.dicebear.com/7.x/rings/svg?seed=${ownerSrc}`}
          height={35}
          width={35}
          />
          <hr className="big-separator"/>
        </>
      )
    }
  },[currentChannelData.owner_id, getUserProfilById])

  // Display Message

  const displayMessage = useCallback(async (item: Message, index: number)=>{
    let profil = await getUserProfilById(item.author_id)
        if (profil === undefined) {
          profil = deletedUserData(item.author_id)
        }
        const itemSrc = profil.name.replace(" ", "_")
        const date = new Date(item.created_at)
        return (
          <div className="message" key={`${item.created_at}_${index}`}>
            <UserHeader
              name={profil.name}
              src={`https://api.dicebear.com/7.x/rings/svg?seed=${itemSrc}`}
              height={35}
              width={35}
            />
            <p>{item.message}</p>
            <span>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</span>
          </div>
        )
  },[getUserProfilById])

  useEffect(()=>{
    displayOwner()
  },[displayOwner, getUserProfilById])

  useEffect(()=>{
    setMemberElement(
      currentChannelData.members.map((item, index)=>{
        if(item.id !== currentChannelData.owner_id) {
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
        }
        return <></>
      })
    )
  },[currentChannelData.members, currentChannelData.owner_id])

  // Display Message List

  useEffect(()=>{
    setMessageElement(
      currentChannelData.messagelogs.toReversed().map((item, index)=>{
        const element = displayMessage(item, index)
        return (
          <>
            {element}
          </>
        )
      })
    )
  },[currentChannelData.messagelogs, displayMessage, getUserProfilById])

  const handleSendMessage = (formData: FormData)=>{
    dispatch(postMessageAction({
      channel_id: currentChannelData.id,
      message: String(formData.get("message"))
    }))
  }

  return (
    <section id="chat-section">
      <div id="chat">
        <div id="message-list">
          {messageElement}
        </div>
        <form action={handleSendMessage}>
          <input type="text" name="message" id=""  required placeholder={`Envoyer un message dans ${currentChannelData.name}`}/>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <div id="users-channel">
        <h1>{currentChannelData.name}</h1>
        <hr className="big-separator"/>
        <div id="users-list">
            {ownerElement}
            {memberElement}
        </div>
      </div>
    </section>
  );
}
