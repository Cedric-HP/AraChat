type ProfilPublic = {
  id: number;
  name: string;
  birthdate: string;
  sexe: string;
};

type FetchUserDataPaylaod = {
  name: string;
  password: string;
};

type ApiToken = {
  res: string;
  access_token: string;
  token_type: "bearer";
};

type Message = {
  id: number;
  author_id: number;
  created_at: string;
  message: string;
};

type MessageAdd = {
  message: string;
  channel_id: number;
}

type ChannelPublic = {
  id: number;
  name: string;
  desc?: string;
  owner_id: number | null;
};

type ChannelPublicList = [
  ChannelPublic
]

type MemberAdd = {
  id: number,
  user_id: number
}

type ChannelCreate = {
  name: string,
  desc?: string
}

type ChannelData = {
  id: number;
  name: string;
  desc?: string;
  owner_id: number | null;
  members: ProfilPublic[]
  messagelogs: Message[];
}

type RegisterRedux = {
  res: string;
  fetchState: string;
};

type Register = {
  name: string;
  birthdate: string;
  sexe: string;
  password: string;
};

type DropDown = "" | "logReg"

type Utilitise = {
  dropDown: DropDown;
  firstFetchChannel: boolean
};

export type {
  ProfilPublic,
  ApiToken,
  Message,
  ChannelPublic,
  FetchUserDataPaylaod,
  Register,
  RegisterRedux,
  Utilitise,
  ChannelPublicList,
  ChannelData,
  ChannelCreate,
  MemberAdd,
  MessageAdd,
  DropDown
};
