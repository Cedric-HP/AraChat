"use client";
/* eslint-disable @next/next/no-img-element */
import type { AppDispatch, RootState } from "../../lib/store";
import { redirect, RedirectType, useSearchParams } from "next/navigation";
import { FormEvent, JSX, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/chat.scss";
import UserHeader from "../Components/UserHeader";
import displayDropDownAction from "@/lib/action/UtilitisesActions/displayDropDownAction";
import fetchProfileAction from "@/lib/action/fetchProfile";
// import postMessageAction from "@/lib/action/postMessageAction";
import { ChannelCreate, Message, ProfilPublic } from "@/lib/type/usersChatType";
import fetchProfileByIdAction from "@/lib/action/fetchProfileById";
import fetchChannelsDataAction from "@/lib/action/fetchChannelDataAction";
import postCreateChannelAction from "@/lib/action/postCreateChannelAction";

// NEW
import { addLiveMessage } from "@/lib/slices/userSlice";
// -----

export default function Chat() {
  const { dropDown } = useSelector(
    (store: RootState) => store.utilitisesReducer
  );
  const {
    isAuthenticated,
    user,
    currentChannelData,
    usersProfilList,
    channelList,
    asToken,
    status,
  } = useSelector((store: RootState) => store.auth);

  const dispatch: AppDispatch = useDispatch();

  // NEW
  const [webs, setWebs] = useState<WebSocket | null>(null);
  // ----

  // NEW: Correction du useEffect pour évité de déconnecter au reload de la page

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      dispatch(fetchProfileAction());
    }
    if (!isAuthenticated && !asToken) {
      console.log("Tentative de chargement de la session initiale...");
      dispatch(fetchProfileAction());
    }
    if (status === "failed") {
      console.log("Le chargement de la session a échoué.");
      if (dropDown !== "logReg") {
        dispatch(displayDropDownAction("logReg"));
      }
      redirect("/", RedirectType.replace);
    }
  }, [asToken, dispatch, dropDown, isAuthenticated, status, user]);

  const roomId = useSearchParams().get("roomId") || "";
  const [ownerElement, setOwnerElement] = useState<JSX.Element>(<></>);
  const [channelElement, setChannelElement] = useState<JSX.Element[]>([]);
  const [memberElement, setMemberElement] = useState<JSX.Element[]>([]);
  const [messageElement, setMessageElement] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (roomId !== "") {
    }
  }, [roomId]);

  // WebSocket Part

  useEffect(() => {
    if (isAuthenticated && currentChannelData && currentChannelData.id !== -1) {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/${currentChannelData.id}`
      );
      ws.onopen = () => {
        console.log(
          `Connected to WebSocket of channel ${currentChannelData.name}`
        );
        setWebs(ws);
      };

      ws.onmessage = (event) => {
        try {
          const newMess: Message = JSON.parse(event.data);
          // newMess.channel_id = currentChannelData.id
          console.log("Message received:", newMess);
          dispatch(addLiveMessage(newMess));
        } catch (err) {
          console.error(err);
        }
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setWebs(null);
      };
      ws.onerror = (error) => {
        console.error("Error Websocket:", error);
      };
      return () => {
        ws.close();
      };
    }
  }, [currentChannelData, dispatch, isAuthenticated]);

  const handleSendMessage = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const message = String(formData.get("message"));
      if (message.trim() && webs && webs.readyState === WebSocket.OPEN) {
        webs.send(JSON.stringify({ message: message }));
        event.currentTarget.reset();
      } else {
        console.error(
          "Impossible d'envoyer le message: Websocket non connecté ou message vide. (bouffon va)"
        );
      }
    },
    [webs]
  );

  const getSrc = (name: string) => {
    if (name.includes("deleted_User_")) {
      return `https://api.dicebear.com/7.x/rings/svg?seed=${name}`;
    }
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`;
  };

  const findUserInArray = useCallback(
    (id: number) => {
      return usersProfilList.find((item) => item.id === id);
    },
    [usersProfilList]
  );

  const getUserProfilById = useCallback(
    async (id: number) => {
      if (isAuthenticated && user !== null) {
        if (user.id === id) {
          return user;
        }
        const find = findUserInArray(id);
        if (find !== undefined) {
          return find;
        }
        await dispatch(fetchProfileByIdAction(id));
        let count = 0;
        const interval = setInterval(() => {
          const findTakeTwo = findUserInArray(id);
          if (findTakeTwo !== undefined) {
            return findTakeTwo;
          }
          if (count >= 10) {
            clearInterval(interval);
          }
          count++;
        }, 500);
      }
    },
    [dispatch, findUserInArray, isAuthenticated, user]
  );

  const deletedUserData = (id: number) => {
    const deletedUser: ProfilPublic = {
      id: id,
      name: `deleted_User_${id}`,
      birthdate: "",
      sexe: "NaN",
    };
    return deletedUser;
  };

  // Display Channel

  useEffect(() => {
    setChannelElement(
      channelList.map((item, index) => {
        return (
          <button
            key={`${item.name}_${index}_Channel`}
            onClick={() => dispatch(fetchChannelsDataAction(item.id))}
          >
            <img
              src={`https://api.dicebear.com/7.x/rings/svg?seed=${item.name}`}
              alt={`Avatar of ${item.name}`}
              height={55}
              width={55}
            />
            <span className="channel-info">{item.name}</span>
          </button>
        );
      })
    );
  }, [channelList, dispatch]);

  // Display Owner

  const displayOwner = useCallback(async () => {
    if (currentChannelData.owner_id !== null) {
      let profil = await getUserProfilById(currentChannelData.owner_id);
      if (profil === undefined) {
        profil = deletedUserData(currentChannelData.owner_id);
      }
      const ownerSrc = profil.name.replace(" ", "_");
      setOwnerElement(
        <>
          <h3 className="member-title">Adminnistrateur</h3>
          <UserHeader
            name={profil.name}
            src={getSrc(ownerSrc)}
            height={35}
            width={35}
          />
          <hr className="big-separator" />
          <h3 className="member-title">Membres</h3>
        </>
      );
    }
  }, [currentChannelData.owner_id, getUserProfilById]);

  useEffect(() => {
    displayOwner();
  }, [displayOwner, getUserProfilById]);

  // Display Member

  useEffect(() => {
    setMemberElement(
      currentChannelData.members.map((item, index) => {
        if (item.id !== currentChannelData.owner_id) {
          const itemSrc = item.name.replace(" ", "_");
          return (
            <div key={`${index}_${item.name}`}>
              <UserHeader
                name={item.name}
                src={getSrc(itemSrc)}
                height={35}
                width={35}
              />
              <hr />
            </div>
          );
        }
        return <></>;
      })
    );
  }, [currentChannelData.members, currentChannelData.owner_id]);

  // Display Message

  const displayMessage = useCallback(
    async (item: Message) => {
      let profil = await getUserProfilById(item.author_id);
      if (profil === undefined) {
        profil = deletedUserData(item.author_id);
      }
      const itemSrc = profil.name.replace(" ", "_");
      const date = new Date(item.created_at);
      return (
        <>
          <UserHeader
            name={profil.name}
            src={getSrc(itemSrc)}
            height={35}
            width={35}
          />
          <p>{item.message}</p>
          <span>{`${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</span>
          {user?.id === profil.id ? (
            <button className="close-button message-remove">X</button>
          ) : (
            <></>
          )}
        </>
      );
    },
    [getUserProfilById, user?.id]
  );

  // Display Message List

  useEffect(() => {
    setMessageElement(
      currentChannelData.messagelogs.toReversed().map((item, index) => {
        const element = displayMessage(item);
        return (
          <div className="message" key={`${item.created_at}_${index}`}>
            {element}
          </div>
        );
      })
    );
  }, [currentChannelData.messagelogs, displayMessage, getUserProfilById]);


  // Handle Create New Channel

  const handleCreateNewChannel = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newChannelData: ChannelCreate = {
        name: String(formData.get("name")),
        desc: String(formData.get("desc"))
      }
      dispatch(postCreateChannelAction(newChannelData))
    },
    [dispatch]
  );

  // Return Displayed

  return (
    <section id="chat-section">
      <div id="channel-list">
        <button>
          <form onSubmit={handleCreateNewChannel}>
            <h2>Créer un nouveaux Channel</h2>
            <label htmlFor="name">Nom du Channel</label>
            <input type="text" name="name" required/>
            <label htmlFor="desc">Description</label>
            <textarea name="desc" placeholder="Description"></textarea>
            <input type="submit" />
          </form>
        </button>
        {channelElement}
      </div>
      <div id="chat">
        <div id="message-list">{messageElement}</div>
        <div>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              name="message"
              id=""
              required
              placeholder={`Envoyer un message dans ${currentChannelData.name}`}
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </div>
      <div id="members">
        <h1>{currentChannelData.name}</h1>
        <hr className="big-separator" />
        <div id="users-list">
          {ownerElement}
          {memberElement}
        </div>
      </div>
    </section>
  );
}
