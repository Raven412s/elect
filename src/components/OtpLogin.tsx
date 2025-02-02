"use client";

import { auth } from "../utils/firebase";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod validation schema for phone number
const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required") // Validation message for empty input
    .regex(
      /^\+\d{1,3}\d{10}$/,
      "Please enter a valid phone number with the country code (e.g., +911234567890)"
    ), // Validation for phone number format
});

type PhoneNumberForm = z.infer<typeof phoneNumberSchema>;

const OtpLogin = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // Removed `phoneNumber` state since it's handled by react-hook-form
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Hook for react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneNumberForm>({
    resolver: zodResolver(phoneNumberSchema),
  });

  // Updated to handle data from react-hook-form
  const requestOtp = async (data: PhoneNumberForm) => {
    const { phoneNumber } = data; // Extract phone number from form data
    setResendCountdown(60);
    setError("");
    setSuccess("");

    if (!recaptchaVerifier) {
      setError("RecaptchaVerifier is not initialized");
      return;
    }

    startTransition(async () => {
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmationResult);
        setSuccess("OTP Sent Successfully.");
      } catch (error: any) {
        console.error(error);
        setResendCountdown(0);

        if (error.code === "auth/invalid-phone-number") {
          setError("Invalid Phone Number. Please Check the Number!");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send the OTP. Please try again.");
        }
      }
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    setRecaptchaVerifier(recaptchaVerifier);
    return () => recaptchaVerifier.clear();
  }, [auth]);

  const loadingIndicator = (
    <div className="h-14 w-14 -mt-10 lg:-mt-40 lg:size-32 ">
      <Image
        src="/loader.svg"
        alt="loader"
        width={10}
        height={10}
        className="w-full h-full"
      />
    </div>
  );

  return (
    <div className="py-5 h-full mx-auto px-8 flex flex-col items-center justify-center md:gap-5 lg:gap-8">
      {!confirmationResult && (
        <form
          onSubmit={handleSubmit(requestOtp)} // Added form submission handling
          className="py-5 mx-auto px-8 flex items-center flex-col"
        >
          <p className="text-black-100 text-lg underline-offset-2 underline mb-5 lg:text-3xl md:text-2xl ">
            Login via OTP
          </p>
          <Input
            {...register("phoneNumber")} // Registered input with react-hook-form
            placeholder="Enter Phone Number"
            className="text-black-100 lg:py-5 lg:text-3xl lg:min-w-max lg:h-[4.3rem] rounded-[15px] lg:rounded-[1.2rem] py-2 px-3 min-w-48 sm:max-w-64 text-xl h-10 lg:mt-[1.8rem] placeholder:text-muted-foreground/90 placeholder:font-medium md:text-[1.5rem] md:py-6 md:px-8 md:min-w-[20rem]"
            type="tel"
          />
          {errors.phoneNumber && ( // Display error messages
            <p className="text-red-500 text-sm mt-2">
              {errors.phoneNumber.message}
            </p>
          )}
          <p className="text-xs lg:text-2xl lg:mt-10 text-muted-foreground mt-2 text-center md:text-lg md:mt-6">
            <span className="text-red-500 text-lg p-0 m-0">*</span>Please enter
            your number with the Country Code. (i.e., +91 for India)
          </p>
          <Button
            type="submit"
            disabled={isPending || resendCountdown > 0}
            className="mt-5 md:text-lg lg:text-3xl lg:p-8 bg-bg-main sm:text-sm"
          >
            {resendCountdown > 0
              ? `Resend OTP in ${resendCountdown}`
              : isPending
              ? "Sending OTP..."
              : "Send OTP"}
          </Button>
        </form>
      )}

      {confirmationResult && (
        <div className="flex flex-col items-center md:gap-5 lg:gap-10">
          <p className="text-black-100 text-lg underline-offset-2 underline mb-5 lg:text-3xl ">
            Enter the 6 digit OTP
          </p>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="mt-5"
          >
            <InputOTPGroup>
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={0}
              />
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={1}
              />
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={2}
              />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={3}
              />
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={4}
              />
              <InputOTPSlot
                className="md:w-20 md:h-20 md:text-3xl lg:w-32 lg:h-32 lg:text-6xl"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
      <div className="text-center p-10">
              { error &&  <p className='text-red-500'>{error}</p>}
              { success &&  <p className='text-green-500'>{success}</p>}
            </div>
      <div id="recaptcha-container" />
      {resendCountdown > 0 && loadingIndicator}
    </div>
  );
};

export default OtpLogin;
