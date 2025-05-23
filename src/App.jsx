import Uploader from "./SideBar";
import "./App.css";
import { useEffect, useState } from "react";
import { Button, Input, CircularProgress } from "@heroui/react";

function App() {
  const [frontText, setFrontText] = useState(null);
  const [backText, setBacktext] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState();

  const getProgress = (p) => {
    console.log(p, "progress");
    setProgress(p);
  };

  const getLoadingStatus = (loading) => {
    setLoading(loading);
  };

  const getText = (text1, text2) => {
    setFrontText(text1);
    setBacktext(text2);
  };

  return (
    <>
      <div className="w-full  h-screen">
        <div className="w-full flex">
          <div className="w-4xl  h-screen">
            <div className="">
              <Uploader
                getTranscription={getText}
                getloadingStatus={getLoadingStatus}
                getProgress={getProgress}
              ></Uploader>
            </div>
          </div>

          {frontText && backText ? (
            <>
              <div className="w-full  flex justify-center items-center    ">
                <form action="" className="w-3xl  ">
                  <div
                    className=" h-[75vh] shadow shadow-neutral-300   flex flex-col justify-center  gap-20 p-5"
                    style={{
                      boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.16)",
                    }}
                  >
                    <h1 className="text-gray-200 font-bold  text-2xl">
                      Personal Details
                    </h1>
                    <div className="flex flex-row w-full gap-3 ">
                      <Input
                        isDisabled
                        className="w-1/2"
                        defaultValue={frontText.aadhaar}
                        label="Email"
                        type="email"
                      ></Input>

                      <Input
                        isDisabled
                        className="w-1/2"
                        defaultValue={frontText.name}
                        label="First Name"
                        type="email"
                      ></Input>
                    </div>
                    <div className="flex flex-row w-full gap-3">
                      <Input
                        isDisabled
                        className="w-1/2"
                        defaultValue={frontText.dob}
                        label="DOB"
                        type="email"
                      ></Input>

                      <Input
                        isDisabled
                        className="w-1/2"
                        defaultValue={frontText.gender}
                        label="Gender"
                        type="email"
                      ></Input>
                    </div>

                    <div className="flex flex-row w-full gap-3">
                      <div className="flex flex-col w-full">
                        <label className="text-md font-medium text-white mb-1">
                          Address
                        </label>
                        <textarea
                          value={backText.address}
                          disabled
                          className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 bg-gray-300 resize-y"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row w-full gap-3">
                      <Input
                        isDisabled
                        className="w-1/2 cursor-pointer"
                        defaultValue={backText.pincode}
                        label="pincode"
                        type="email"
                      ></Input>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="w-full  flex flex-col justify-center items-center ">
                <div>
                  <p className="font-bold text-3xl text-white">
                    Upload your Aadhaar card{" "}
                  </p>
                </div>
                {isLoading && (
                  <>
                    <div className="w-32 h-32">
                      <CircularProgress
                        aria-label="Loading..."
                        color="warning"
                        showValueLabel={true}
                        value={progress}
                        className="w-full h-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
