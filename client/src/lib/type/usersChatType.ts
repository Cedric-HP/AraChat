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
  creatAt: string;
  message: string;
};

type ChannelPublic = {
  id: number;
  name: string;
  desc?: string;
  owner: number | null;
};

type ChannelPublicList = [
  ChannelPublic
]

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

type Utilitise = {
  currentRoom: ChannelPublic;
  logReg: boolean;
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
  ChannelPublicList
};
