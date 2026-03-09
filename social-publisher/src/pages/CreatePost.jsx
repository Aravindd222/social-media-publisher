import React, { useState, useRef, useEffect } from "react";
import API from "../api/api";
import { getSocialStatus } from "../api/posts";

import {
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/solid";

export default function CreatePost() {

  const [step, setStep] = useState(1);

  const [platforms, setPlatforms] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);

  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [hasAccounts, setHasAccounts] = useState(false);

  const [content, setContent] = useState("");

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);


  /*
    FETCH SOCIAL STATUS
  */
 useEffect(() => {

  const fetchStatus = async () => {

    try {

      const status = await getSocialStatus();

      console.log("SOCIAL STATUS:", status);

      const platforms = [];

      if (status.linkedin_connected)
        platforms.push("linkedin");

      if (status.instagram_connected)
        platforms.push("instagram");

      setAvailablePlatforms(platforms);

      if (platforms.length > 0) {

        setHasAccounts(true);
        setPlatforms([platforms[0]]);

      } else {

        setHasAccounts(false);

      }

    } catch (err) {

      console.error("Failed to fetch social status", err);
      setHasAccounts(false);

    } finally {

      setAccountsLoaded(true);

    }

  };

  fetchStatus();

}, []);



  /* IMAGE */

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImage(null);
    setImagePreview(null);
  };


  /* SUBMIT */

  const handleSubmit = async () => {

  if (!content.trim()) {
    alert("Post content cannot be empty");
    return;
  }

  if (platforms.length === 0) {
    alert("Select at least one platform");
    return;
  }

  /*
    GLOBAL VALIDATION FIRST (CRITICAL FIX)
  */

  // Instagram requires image
  if (platforms.includes("instagram") && !image) {
    alert("Instagram requires an image. Please upload an image to post on Instagram.");
    return;
  }

  // scheduling validation
  if (isScheduled && !scheduledAt) {
    alert("Please select a scheduled date and time.");
    return;
  }


  /*
    ONLY AFTER ALL VALIDATIONS PASS
  */

  setLoading(true);

  try {

    const requests = [];


    /*
      LINKEDIN
    */
    if (platforms.includes("linkedin")) {

      const formData = new FormData();

      formData.append("content", content);

      if (image)
        formData.append("image", image);

      if (isScheduled)
        formData.append(
          "scheduled_at",
          new Date(scheduledAt).toISOString()
        );

      requests.push(
        API.post(
          isScheduled
            ? "/social/schedule/linkedin"
            : "/social/publish",
          formData
        )
      );

    }


    /*
      INSTAGRAM
    */
    if (platforms.includes("instagram")) {

      const formData = new FormData();

      formData.append("caption", content);
      formData.append("image", image);

      if (isScheduled)
        formData.append(
          "scheduled_at",
          new Date(scheduledAt).toISOString()
        );

      requests.push(
        API.post(
          isScheduled
            ? "/social/schedule/instagram"
            : "/social/publish/instagram",
          formData
        )
      );

    }


    /*
      EXECUTE PARALLEL
    */
    await Promise.all(requests);


    /*
      RESET
    */
    setContent("");
    setScheduledAt("");
    setImage(null);
    setImagePreview(null);
    setPlatforms([]);
    setStep(1);


  } catch (err) {

    console.error(err);
    alert("Publishing failed");

  } finally {

    setLoading(false);

  }

};




  const togglePlatform = (p) => {

  setPlatforms(prev => {

    if (prev.includes(p)) {
      return prev.filter(x => x !== p);
    } else {
      return [...prev, p];
    }

  });

};

  const step1Valid =
    content.trim() !== "" &&
    (!isScheduled || scheduledAt);

const step2Valid =
  platforms.length > 0 &&
  platforms.every(p => availablePlatforms.includes(p));



  /*
    LOADING STATE
  */

  if (!accountsLoaded) {

    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 text-center">
          Loading accounts...
        </div>
      </div>
    );

  }



  /*
    NO ACCOUNTS CONNECTED
  */

  if (!hasAccounts) {

    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            No social accounts configured
          </h2>
          <p className="text-gray-500 mt-2">
            Please connect Instagram or LinkedIn to create posts.
          </p>
        </div>
      </div>
    );

  }



  /*
    NORMAL CREATE POST UI
  */

  return (

    <div className="mx-auto max-w-2xl animate-in fade-in duration-300">

      {/* STEP INDICATOR */}

      <div className="flex items-center justify-center gap-4 mb-8">

        {[1,2].map(s => (

          <div key={s} className="flex items-center gap-3">

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
              ${
                s === step
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md scale-105"
                  : s < step
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s < step ? "✓" : s}
            </div>

            <span className={`text-sm font-medium transition-colors duration-300 ${
              s === step
              ? "text-gray-900"
              : "text-gray-500"
            }`}>
              {s===1 ? "Post Details" : "Select Platforms"}
            </span>

            {s===1 &&
              <div className="w-12 h-px bg-gray-300"/>
            }

          </div>

        ))}

      </div>



      {/* CARD */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-300">


        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">

          <h2 className="text-white font-semibold text-lg">
            {step===1 ? "Post Details" : "Select Platforms"}
          </h2>

          <p className="text-white/80 text-sm">
            {step===1
              ? "Write your content, add media, and choose when to publish"
              : "Choose where to publish your post"}
          </p>

        </div>



        {/* STEP 1 */}

        {step===1 && (

          <div className="p-6 space-y-6 animate-in slide-in-from-right duration-300">

            {/* CONTENT */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Content *
              </label>

              <textarea
                rows={5}
                value={content}
                onChange={e=>setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-all duration-200 outline-none"
              />

            </div>



            {/* MEDIA */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Media
              </label>

              {imagePreview ? (

                <div className="relative group">

                  <img
                    src={imagePreview}
                    className="w-full h-48 object-cover rounded-lg border transition-all duration-300 group-hover:scale-[1.02]"
                  />

                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                  >
                    <XMarkIcon className="h-4 w-4"/>
                  </button>

                </div>

              ) : (

                <div
                  onClick={()=>fileRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer
                  hover:border-indigo-500 hover:bg-indigo-50/30
                  transition-all duration-200"
                >

                  <CloudArrowUpIcon className="h-10 w-10 mx-auto text-gray-400"/>

                  <p className="text-sm mt-2 text-gray-600">
                    <span className="text-indigo-600 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>

                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 10 MB
                  </p>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                </div>

              )}

            </div>



            {/* PUBLISH TOGGLE */}

            <div>

              <label className="block text-sm font-medium mb-3">
                When to publish
              </label>

              <div className="flex gap-4">

                <button
                  onClick={()=>setIsScheduled(false)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    !isScheduled
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  Publish Now
                </button>


                <button
                  onClick={()=>setIsScheduled(true)}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isScheduled
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  Schedule for later
                </button>

              </div>

            </div>



            {isScheduled && (

              <div className="animate-in fade-in duration-300">

                <label className="block text-sm font-medium mb-2">
                  Date & Time *
                </label>

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e=>setScheduledAt(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200 outline-none"
                />

              </div>

            )}



            {/* NEXT */}

            <div className="flex justify-end">

              <button
                disabled={!step1Valid}
                onClick={()=>setStep(2)}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2.5 rounded-lg shadow
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:hover:scale-100
                transition-all duration-200 flex items-center gap-2"
              >
                Next
                <ArrowRightIcon className="h-4 w-4"/>
              </button>

            </div>


          </div>

        )}



        {/* STEP 2 */}

        {step===2 && (

          <div className="p-6 space-y-4 animate-in slide-in-from-left duration-300">

            {availablePlatforms.map(p => {

              const selected = platforms.includes(p);

              return (

                <button
                  key={p}
                  onClick={()=>togglePlatform(p)}
                  className={`w-full flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-sm
                  ${
                    selected
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold transition-all duration-200
                    ${
                      selected
                      ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}>
                      {p==="linkedin"?"in":"Ig"}
                    </div>

                    <span className="capitalize font-medium">
                      {p}
                    </span>

                  </div>

                  {selected &&
                    <CheckCircleIcon className="h-5 w-5 text-indigo-600"/>
                  }

                </button>

              );

            })}



            <div className="flex justify-between pt-4">

              <button
                onClick={()=>setStep(1)}
                className="border rounded-lg px-5 py-2 hover:bg-gray-50 transition"
              >
                Back
              </button>


              <button
                onClick={handleSubmit}
                disabled={!step2Valid || loading}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2.5 rounded-lg shadow
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isScheduled
                  ? "Save & Schedule Post"
                  : "Save & Publish Post"}
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}