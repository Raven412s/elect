"use client"
import {auth} from '../utils/firebase'
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, {FormEvent,useEffect, useState, useTransition} from 'react'
import {InputOTP,InputOTPSeparator,InputOTPSlot,InputOTPGroup} from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
const OtpLogin = () => {
    const router = useRouter()
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState("")
    const [resendCountdown, setResendCountdown] = useState(0)
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
    const [isPending, startTransition] = useTransition()

   useEffect(() => {
     let timer : NodeJS.Timeout;
     if (resendCountdown > 0 ) {timer = setTimeout( ( ) => setResendCountdown(resendCountdown - 1), 1000 ) }
     return () => clearTimeout(timer)
   }, [resendCountdown])

   useEffect(() => {
     const recaptchaVerifier = new RecaptchaVerifier(auth,"recaptcha-container",  {size: "invisible"});
     setRecaptchaVerifier(recaptchaVerifier);
     return () =>recaptchaVerifier.clear();
   }, [auth])

   const requestOtp = async(e ?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    setResendCountdown(60)
    startTransition(async () => {
        setError("")
        if(!recaptchaVerifier){
            setError("RecaptchaVerifier is not initialized")
        }
        try {
            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier!
            )
            setConfirmationResult(confirmationResult)
            setSuccess("OTP Sent Successfully.")
        } catch (error: any) {
            console.error(error);
            setResendCountdown(0)

            if(error.code === "auth/invalid-phone-number") {
                setError("Invalid Phone Number. Please Check the Number!")
            } else if (error.code === "auth/too-many-requests") {
                setError("Too many requests. Please try again later.")
            } else {
                setError("Failed to send the OTP. Please try again.")
            }
        }
    })
   }

   const loadingIndicator = (
        <div className="flex ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#A29FFF"></stop><stop offset=".3" stop-color="#A29FFF" stop-opacity=".9"></stop><stop offset=".6" stop-color="#A29FFF" stop-opacity=".6"></stop><stop offset=".8" stop-color="#A29FFF" stop-opacity=".3"></stop><stop offset="1" stop-color="#A29FFF" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="10" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="3" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#A29FFF" stroke-width="10" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>
        </div>
   )
  return (
    <div className='py-5 h-full mx-auto px-8 flex flex-col items-center justify-center '>
        <p className='text-black-100 text-lg underline-offset-2 underline '>Login via OTP</p>
        {!confirmationResult && (
            <form onSubmit={requestOtp} className='py-5 mx-auto px-8 flex items-center flex-col'>
                <Input
                    placeholder='Enter PhoneNumber'
                    className='text-black-100 rounded-[15px] py-2 px-3 min-w-48 max-w-64 text-xl h-10 placeholder:text-muted-foreground/90 placeholder:font-medium '
                    type='tel'
                    value={phoneNumber}
                    onChange={(e)=>setPhoneNumber(e.target.value)}
                />
                <p className='text-xs text-muted-foreground mt-2 text-center'>
                    <span className='text-red-500 text-lg p-0 m-0  '>* </span>Please enter your number with the Country Code. (i.e., +91 for India)
                </p>
            </form>
        )}
            <Button
            disabled={!phoneNumber || isPending || resendCountdown > 0}
            onClick={()=>requestOtp()}
            className='mt-5'
            >
                {resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}`
                : isPending
                ? "Sending OTP..."
                : "Send OTP"
                }
            </Button>
            <div className="text-center p-10">
              { error &&  <p className='text-red-500'>{error}</p>}
              { success &&  <p className='text-green-500'>{success}</p>}
            </div>
        <div id="recaptcha-container" />
        {isPending && loadingIndicator }
    </div>

  )
}

export default OtpLogin
