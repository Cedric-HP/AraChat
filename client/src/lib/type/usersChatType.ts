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
  channelList: Channel[]
};

type Message = {
  id: number;
  creatAt: string;
  message: string;
};

type Channel = {
  id: number;
  name: string;
};

type ChannelData = {
  desc?: string;
  owner: number;
  authoriseUserList: number[];
  messageLog: Message[];
};

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
  currentRoom: Channel;
  logReg: boolean;
};

export type {
  ProfilPublic,
  ApiToken,
  Message,
  ChannelData,
  FetchUserDataPaylaod,
  Register,
  RegisterRedux,
  Channel,
  Utilitise,
};
