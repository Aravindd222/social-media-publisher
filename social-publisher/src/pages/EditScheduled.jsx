import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/solid";

import {
  getPostById,
  editScheduledPost,
  cancelScheduledPost,
} from "../api/posts";

const EditScheduled = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [platform, setPlatform] = useState("");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fileInputRef = useRef(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      newImages.forEach(img => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

  // Load post
  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {

    try {

      const post = await getPostById(id);

      setPlatform(post.platform);
      setContent(post.content);

      const localDate =
        new Date(post.scheduled_at).toISOString().slice(0, 16);

      setScheduledAt(localDate);

      if (post.media_url) {
        setExistingImages([post.media_url]);
      }

      setLoading(false);

    } catch (err) {

      console.error(err);
      navigate("/scheduled");

    }

  };

  // Handle file upload
  const handleFiles = useCallback((files) => {

    const added = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setNewImages(prev => [...prev, ...added]);

  }, []);

  const removeExistingImage = (index) => {

    setExistingImages(prev =>
      prev.filter((_, i) => i !== index)
    );

  };

  const removeNewImage = (index) => {

    URL.revokeObjectURL(newImages[index].preview);

    setNewImages(prev =>
      prev.filter((_, i) => i !== index)
    );

  };

  // Save edit with loading animation
  const handleSave = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      // UX delay (1.5 sec)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const formData = new FormData();

      formData.append("content", content);

      formData.append(
        "scheduled_at",
        new Date(scheduledAt).toISOString()
      );

      if (newImages.length > 0) {
        formData.append("image", newImages[0].file);
      }

      await editScheduledPost(id, formData);

      navigate("/scheduled");

    } catch (err) {

      console.error("edit failed:", err);

    } finally {

      setSaving(false);

    }

  };

  // Cancel post
  const handleCancel = async () => {

    try {

      await cancelScheduledPost(id);

      navigate("/scheduled");

    } catch (err) {

      console.error(err);

    }

  };

  if (loading) {

    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );

  }

  return (

    <div className="max-w-3xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate("/scheduled")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition active:scale-95"
      >
        <ArrowLeftIcon className="h-4 w-4"/>
        Back to Scheduled Posts
      </button>


      {/* Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">

          <h2 className="text-white text-lg font-semibold">
            Edit Scheduled Post
          </h2>

          <p className="text-white/80 text-sm">
            Modify content, images, or reschedule — {platform}
          </p>

        </div>


        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">

          {/* Platform */}
          <div>

            <label className="block text-sm font-medium mb-1">
              Platform
            </label>

            <input
              value={platform}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
            />

          </div>


          {/* Content */}
          <div>

            <label className="block text-sm font-medium mb-1">
              Content
            </label>

            <textarea
              value={content}
              onChange={(e)=>setContent(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />

          </div>


          {/* Images */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Add / Replace Images
            </label>


            {/* Existing image */}
            {existingImages.length > 0 && (

              <div className="relative w-fit">

                <img
                  src={existingImages[0]}
                  className="w-64 rounded-lg border"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(0)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition active:scale-90"
                >
                  <XMarkIcon className="w-4 h-4"/>
                </button>

              </div>

            )}


            {/* New image */}
            {newImages.map((img,i)=>(

              <div key={i} className="relative w-fit">

                <img
                  src={img.preview}
                  className="w-64 rounded-lg border"
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition active:scale-90"
                >
                  <XMarkIcon className="w-4 h-4"/>
                </button>

              </div>

            ))}


            {/* Upload box */}
            {(existingImages.length === 0 && newImages.length === 0) && (

              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition active:scale-95"
              >

                <PhotoIcon className="w-10 h-10 mx-auto text-gray-400"/>

                <p className="text-indigo-600 font-medium mt-2">
                  Click to upload
                </p>

                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>

              </div>

            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e)=>handleFiles(e.target.files)}
            />

          </div>


          {/* Date */}
          <div>

            <label className="block text-sm font-medium mb-1">
              Scheduled Date & Time
            </label>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e)=>setScheduledAt(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />

          </div>


          {/* Buttons */}
          <div className="flex gap-4 pt-2">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 rounded-lg font-medium transition active:scale-95 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              )}

              {saving ? "Saving..." : "Save Changes"}

            </button>


            <button
              type="button"
              onClick={handleCancel}
              className="px-6 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition active:scale-95"
            >
              Cancel Post
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default EditScheduled;