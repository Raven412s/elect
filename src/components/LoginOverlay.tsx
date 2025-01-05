import Image from 'next/image'
import React from 'react'

const LoginOverlay = () => {
  return (
    <div>
        <Image
            className="absolute -z-10 -hue-rotate-[43deg]  bottom-0 right-0 md:hidden object-cover    min-w-screen lg:hidden  self-center"
            alt="bottom wave"
            src={"/BottomWave.svg"}
            width={900}
            height={20}
        />
        <Image
            className="absolute -z-10 -hue-rotate-[43deg]  top-0 left-0 rotate-180  md:hidden object-cover  min-w-screen lg:hidden self-center"
            alt="bottom wave"
            src={"/BottomWave.svg"}
            width={900}
            height={20}
        />
      <div className="lg:flex md:flex  hidden ">
      <Image
            className="absolute -z-10 -hue-rotate-[43deg]  bottom-0 right-0  max-h-56  min-w-screen   self-center"
            alt="bottom wave"
            src={"/LgWave.svg"}
            width={900}
            height={30}
        />
      <Image
            className="absolute -z-10 -hue-rotate-[43deg]  bottom-0 left-0  max-h-56  min-w-screen   self-center"
            alt="bottom wave"
            src={"/LgWave.svg"}
            width={900}
            height={30}
        />
      </div>
        <div className="lg:flex md:flex hidden ">
        <Image
            className="absolute -z-10 -hue-rotate-[43deg]  top-0 left-0 rotate-180 max-h-56  min-w-screen   self-center"
            alt="bottom wave"
            src={"/LgWave.svg"}
            width={900}
            height={30}
        />
        <Image
            className="absolute -z-10 -hue-rotate-[43deg]  top-0 right-0 rotate-180 max-h-56  min-w-screen   self-center"
            alt="bottom wave"
            src={"/LgWave.svg"}
            width={900}
            height={30}
        />
        </div>
    </div>
  )
}

export default LoginOverlay
