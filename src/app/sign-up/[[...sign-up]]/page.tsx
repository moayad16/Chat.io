import { SignUp } from "@clerk/nextjs";
import "animate.css"

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center animate__animated animate__fadeIn animate__faster">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#0583F2",
            colorBackground: "#0F1626",
            colorInputBackground: "#0F1626",
            colorText: "white",
            colorTextOnPrimaryBackground: "white",
          },
        }}
      />
    </div>
  );
}
