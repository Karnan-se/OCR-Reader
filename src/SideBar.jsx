import axios from "axios";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
import { Button } from "@heroui/react";

export default function Uploader({getTranscription , getloadingStatus , getProgress }) {
  const useInputRef = useRef();
  const useInputRef2 = useRef();
  const [image, setImage] = useState();
  const [file, setFile] = useState(null);
  const [fileBack, setFileBack] = useState(null);
  const [imageBack, setImageBack] = useState();
  const [frontSideText , setFrontSideText]= useState()
  const [backsideText , setBackSideText]= useState()
  const [isLoading , setLoading] = useState(false)
  const [isActiveBack , setActiveBack] = useState(false)
 

  
getloadingStatus(isLoading)

async function handleTessaract(files) {
  try {
    setLoading(true)
    
    const result = await Tesseract.recognize(files, "eng+hin", {
      logger: (m) => {
        
        getProgress(Math.round(m.progress * 100))
      },
      
    });

    const text = result.data.text;
    console.log("OCR Result:", text);

    return text; 
  } catch (err) {
    console.error("OCR failed:", err);
    return null;

  }finally {
    setLoading(false)

  }
}

function extractAddressInfo(rawText) {
  const result = {
    address: '',
    pincode: ''
  };


  let text = rawText
    .replace(/[^\x00-\x7F]/g, '')       
    .replace(/[^a-zA-Z0-9\s,.-]/g, '')    
    .replace(/\s+/g, ' ')
    .trim();

  
  const startIndex = text.toLowerCase().indexOf('s/o');
  text = startIndex !== -1 ? text.substring(startIndex) : text;

  
  const lines = text
    .split(/[\n,]/)
    .map(line =>
      line
        .split(' ')
        .filter(word => word.length > 2 && !/^\d{1,2}$/.test(word))
        .join(' ')
    )
    .filter(Boolean);

  result.address = lines.join(', ').replace(/,+/g, ',').replace(/,\s*,/g, ',').trim();

  const match = rawText.match(/(\d{6})(?!.*\d)/);
  if (match) {
    result.pincode = match[1];
  }

  return result;
}




function extractImportantFields(text) {
  console.log(text , "before extre")

  const result = {
    name: '',
    dob: '',
    gender: '',
    aadhaar: ''
  };

  const lines = text.split('\n').map(line => line.trim());

  for (const line of lines) {
    const cleanLine = line.replace(/[^\x00-\x7F]+/g, '').trim(); 

   
    if (!result.name && /[A-Z][a-z]+ [A-Z][a-z]+/.test(cleanLine)) {
      result.name = cleanLine.match(/[A-Z][a-z]+ [A-Z][a-z]+/)[0];
    }

   
    if (!result.dob && /(\d{2}\/\d{2}\/\d{4})/.test(line)) {
      result.dob = line.match(/(\d{2}\/\d{2}\/\d{4})/)[0];
    }

 
    if (!result.gender && /(Male|Female|Other)/i.test(cleanLine)) {
      result.gender = cleanLine.match(/(Male|Female|Other)/i)[0];
    }

  
    if (!result.aadhaar && /(\d{4}\s?\d{4}\s?\d{4})/.test(cleanLine)) {
      result.aadhaar = cleanLine.match(/(\d{4}\s?\d{4}\s?\d{4})/)[0].replace(/\s+/g, '');
    }
  }


  return result;
}

const validate = (obj)=>{

    for(let keys in obj){
      if(!obj[keys]){
        console.log("some keys are undefined")
        return false
      }
    }
    return obj
  
}




  useEffect(() => {
    if (file && fileBack) {
      getTranscription(null , null)
      
      
      async function getText(){
        const text =  validate (extractImportantFields ( await handleTessaract(file) ) )
        const text2 =  validate( extractAddressInfo ( ( await handleTessaract(fileBack) ) ) )

        console.log(text , "text 1")
        console.log(text2 , "text2")
        if(!text){
          toast.error("it is not aadhar")
          return 
        }

        if(!text2){
          toast.error("it is not aadhar")
        }
      
        getTranscription(text , text2)

      }
      getText()
    }
  }, [file, fileBack]);

  const handleClck = () => {
    useInputRef.current?.click();
  };
  const handleClck2 = () => {
    console.log("clicked")
    console.log(useInputRef.current)
    useInputRef2.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    } else {
      
      e.target.value = null;
      toast.error("images are only accepted");
    }
    return;
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("image/")) {
      setFileBack(file);
      setImageBack(URL.createObjectURL(file));
    } else {
      e.target.value = null;
    }
    return;
  };

    const replaceImage2 =()=>{
    console.log("hello")
    setFileBack(null)
    setImageBack(null)
    handleClck2()
  }

  const replaceImage = ()=>{
    setFile(null)
    setImage(null)
    handleClck()
  }

  return (
    <>
      <div className="w-full flex-col h-[100vh] p-25">
        <div className="h-1/2  w-full justify-center items-center flex  flex-col  ">
          {image ? (
            <>
            <div className="w-full h-full relative">  
              <img src={image} className="object-cover h-full w-full " alt="" />

                 <div className=" absolute bottom-0 left-0 w-full h-14 flex items-center justify-center  ">
           <Button className=" border shadow shadow-amber-200" onPress={ replaceImage}> Replace Image</Button>
          </div>
          </div>
            </>
          ) : (
            <div
              className="group border border-dashed w-1/2 h-1/2 flex flex-col justify-center
           items-center cursor-pointer gap-2.5 transition-transform duration-300 hover:scale-95  shadow-xl hover:shadow-md shadow-gray-500 border-gray-500"
              onClick={handleClck}
            >
              <Upload className="group-hover:scale-200 transition-transform duration-300  text-white "></Upload>
              <p className="transition-transform duration-300 group-hover:translate-y-10 hover:text-xs hover:scale-0  text-white ">
                Upload FrontSide
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={useInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <div className="h-1/2  w-full justify-center items-center flex  flex-col  ">
          {imageBack ? (
           <div className="relative w-full h-full" 

            onMouseEnter={()=> setActiveBack(true)}
            onMouseLeave={()=> setActiveBack(false)}
            
            >
          <img src={imageBack } alt="Background image" className="w-full h-full object-cover" />
            {isActiveBack && (
          <div className=" absolute bottom-0 left-0 w-full h-14 flex items-center justify-center  ">
           <Button className=" border shadow shadow-amber-200" onPress={ replaceImage2}> Replace Image</Button>
          </div>
            )}

        </div>
          ) : (
            <>
              <div
                className="group border border-dashed w-1/2 h-1/2 flex flex-col justify-center
           items-center cursor-pointer gap-2.5 transition-transform duration-300 hover:scale-95 shadow-xl  hover:shadow-md shadow-gray-500  border-gray-500 "
                onClick={handleClck2}
               
              >
                
                <Upload className="group-hover:scale-200 transition-transform duration-300   " color="white"></Upload>
                <p className="transition-transform duration-300 group-hover:translate-y-10 hover:text-xs hover:scale-0 text-white  border-gray-500">
                  Upload Backside
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={useInputRef2}
                  onChange={handleFileChange2}
                />
              </div>
            </>
          )}
        </div>




      </div>
    </>
  );
}
