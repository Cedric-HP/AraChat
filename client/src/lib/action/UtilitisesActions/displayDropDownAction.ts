import { DropDown } from "@/lib/type/usersChatType";
import { createAction } from "@reduxjs/toolkit";



const displayDropDownAction= createAction<DropDown>("UTILITISES-REDUCER/displayDropDown");

export default displayDropDownAction;