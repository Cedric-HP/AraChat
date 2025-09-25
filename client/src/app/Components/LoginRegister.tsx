"use client"
import { JSX, useCallback, useEffect, useState, type FC } from "react";
import "../styles/loginregister.scss"
import type { AppDispatch, RootState } from "../../lib/store";
import fetchUserDataAction from "@/lib/action/fetchUserData";
import { useDispatch, useSelector } from "react-redux";
import { redirect, RedirectType } from 'next/navigation'
import postRegisterAction from "@/lib/action/postRegister";
import displayLogRegAction from "@/lib/action/UtilitisesActions/displayLogRegAction";

type InputData = React.ChangeEvent<HTMLInputElement>
const regularExpression  = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/

const LoginRegister: FC = () => {

    const {status, error} = useSelector(
        (store: RootState) => store.auth
    )
    const dispatch: AppDispatch = useDispatch()

    const [pageState, setPageState] = useState<"login" | "register">("login")
    const [pageElement, setPageElement] = useState<JSX.Element>(<p></p>)
    const [initialPassword, setInitialPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [isValid, setIsValid] = useState<boolean>(false)
    const [passwordFeedback, setPasswordFeedback] = useState<string>("")
    const [statusElement, setStatusElement] = useState<JSX.Element>(<p></p>)

    const handleLogin =  useCallback(async (formdata: FormData) => {
        dispatch(fetchUserDataAction({
            name: String(formdata.get("name")),
            password: String(formdata.get("password"))
        }))
    },[dispatch])

    const handleRegister =  useCallback(async (formdata: FormData) => {

         dispatch(postRegisterAction({
            name: String(formdata.get("name")),
            birthdate: String(formdata.get("birthdate")),
            sexe: String(formdata.get("sexe")),
            password: String(formdata.get("password")),
        }))
    },[dispatch])

    const handlePassword = useCallback((inputData: InputData) =>{
        setInitialPassword(String(inputData.target.value))

    },[])

    const handleConfirmPassword = useCallback((inputData: InputData) =>{
        setConfirmPassword(String(inputData.target.value))
    },[])

    const handleSubmitLogin = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        handleLogin(formData)
    }, [handleLogin])

    const handleSubmitRegister = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        handleRegister(formData)
    }, [handleRegister])

    useEffect(()=> {
        if(initialPassword === confirmPassword  && regularExpression.test(initialPassword) ) {
            setIsValid(true)
            setPasswordFeedback("")
            return
        }
        if(initialPassword.length >= 8 && !regularExpression.test(initialPassword)){
            setPasswordFeedback("C'est de la merde!")
            return
        }
        if(confirmPassword !== "")
            setPasswordFeedback("Les deux mots de foutres doivent être identiques")
        else 
            setPasswordFeedback("")
        if(isValid)
            setIsValid(false)
    },[confirmPassword, initialPassword, isValid])

    useEffect(()=>{
        switch(status) {
            case "idle":
                setStatusElement(<p></p>)
                break;
            case "loading":
                setStatusElement(<p>Chargement</p>)
                break;
            case "succeeded":
                setStatusElement(<p>{pageState === "login" ? "Connection" : "Inscription"} réussie!</p>)
                setTimeout(()=>{
                    dispatch(displayLogRegAction())
                    if (pageState === "login") {
                        redirect('/chat', RedirectType.replace)
                    }
                },1000)
                break;
            case "failed":
                setStatusElement(<p>{error}</p>)
                break;
        }
    },[dispatch, error, pageState, status])
    
    useEffect(()=>{
        switch(pageState){
            case"login":
                setPageElement(
                    <>  
                        <form onSubmit={handleSubmitLogin}>
                            <label htmlFor="name">Pseudo</label>
                            <input type="text" name="name" id="name"/>
                            <label htmlFor="password">Mot de foutre</label>
                            <input type="password" name="password" id="password" />
                            <input type="submit" value="Se Connecter"/>
                            {statusElement}
                        </form>
                        <button onClick={()=>setPageState("register")}>Register</button>
                    </>
                )
                break
            case"register":
                setPageElement(
                    <>  
                        <form onSubmit={handleSubmitRegister}>
                            <label htmlFor="name">Pseudo</label>
                            <input type="text" name="name" required/>
                            <label htmlFor="birthdate">Date de naissance</label>
                            <input type="date" name="birthdate" required/>
                            <label htmlFor="sexe">Sexe</label>
                            <select name="sexe">
                                <option value="NaN">NaN</option>
                                <option value="female">Female</option>
                                <option value="futa">Futanari</option>
                                <option value="tomboy">Tomboy</option>
                                <option value="femboy">Femboy</option>
                                <option value="male">Male</option>
                            </select>
                            <label htmlFor="password">Mot de foutre</label>
                            <span>{initialPassword.length < 8 ? `${initialPassword.length}/8` : "Good"}</span>
                            <input type="password" name="password" onChange={handlePassword} required/>
                            <label htmlFor="password-confirm">Confirmer le Mot de foutre</label>
                            <input type="password" name="password-confirm" onChange={handleConfirmPassword} required/>
                            <p>{passwordFeedback}</p>
                            {statusElement}
                            <input type="submit" value="S'Enregister" disabled={!isValid}/>
                        </form>
                        <button onClick={()=>setPageState("login")}>Login</button>
                    </>
                )
                break
        }
    },[handleConfirmPassword, handleLogin, handlePassword, handleRegister, handleSubmitLogin, handleSubmitRegister, initialPassword.length, isValid, pageState, passwordFeedback, statusElement])

    return (
        <>
            <div id="log-reg">
                <button onClick={()=>dispatch(displayLogRegAction())}>X</button>
                {pageElement}
            </div>
        </>
    )
}

export default LoginRegister