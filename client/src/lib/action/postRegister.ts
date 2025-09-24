import { createAsyncThunk } from "@reduxjs/toolkit";
import { Register, ProfilPublic } from "../type/usersChatType";

const postRegisterAction = createAsyncThunk<ProfilPublic, Register>(
  "USERS-CHAT-REDUCER/postRegister",
  async ({ name, birthdate, sexe, password }) => {
    console.log({
      name: name,
      birthdate: birthdate,
      sexe: sexe,
      password: password,
    });
    try {
      const res = await fetch(`http://localhost:8000/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          birthdate,
          sexe,
          password,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail ||`Http error. status: ${res.status}`);
      }

      const data: ProfilPublic = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);
export default postRegisterAction;
