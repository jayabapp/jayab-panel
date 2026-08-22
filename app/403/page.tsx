import Link from "next/link";
// import lottieAnimation from "@/public/assets/lotties/warning.json";

const ForbiddenPage = () => {
  return (
    <div className="bg-danger text-center flex flex-col justify-center items-center h-screen w-screen fixed right-0 top-0 py-28 mx-auto">
      {/* <Lottie width={100} height={100} options={{ animationData: lottieAnimation }} /> */}

      <h1 className="text-[48px] font-bold text-white">403</h1>
      <p className="text-white text-xl font-bold ">
        {"دسترسی شما به این صفحه امکان پذیر نیست!"}
      </p>
      <Link href="/">
        <button className="px-3 py-3 rounded-lg bg-black text-warning mt-4 shadow-lg   ">
          {"بازگشت به صفحه اصلی"}
        </button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
