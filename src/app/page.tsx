import LoginOverlay from "@/components/LoginOverlay";
import OtpLogin from "@/components/OtpLogin";
import Image from "next/image";
export default function Home() {
  return (
    <>
        <div className="relative h-full">
        <OtpLogin />
        <LoginOverlay/>
        </div>
    </>
  );
}
