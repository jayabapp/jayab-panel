// import Lottie from "react-lottie";
import React, { useEffect } from "react";
import Link from "next/link";

// import Lottie from "react-lottie";
// import lottieAnimation from "@/public/assets/lotties/loading.json";

const NotFoundPage = () => {
  return (
    <div className="bg-warning text-center flex flex-col justify-center items-center h-screen w-screen fixed right-0 top-0 py-28 mx-auto z-50">
      {/* <Lottie width={600} height={300} options={{ animationData: lottieAnimation, loop: true }} /> */}
      <h1 className="text-[48px] font-bold text-white">404</h1>
      <p className="text-white text-xl font-bold ">{"صفحه مورد نظر یافت نشد"}</p>
      <Link href="/">
        <button className="px-3 py-3 rounded-lg bg-black text-warning mt-4 shadow-lg   ">
          {"بازگشت به صفحه اصلی"}
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
