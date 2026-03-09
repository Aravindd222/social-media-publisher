import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScheduledPosts,cancelScheduledPost } from "../api/posts";


const Scheduled = () => {
  const navigate = useNavigate();

  // use real API data (from your working code)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getScheduledPosts().then((data) => {
      setPosts(data || []);
    });
  }, []);

  const handleCancel = async (id) => {

  try {

    await cancelScheduledPost(id);

  
    setPosts(prev => prev.filter(post => post.id !== id));

  } catch (err) {

    console.error(err);

  }

};

  return (
    <div className="rounded-xl bg-card card-shadow hover-card page-enter">

      {/* Header */}
      <div className="bg-indigo-600 rounded-t-xl gradient-info px-6 py-4">
        <h3 className="text-2xl font-semibold mb-6 text-white">
          Scheduled Posts
        </h3>

        <p className="text-sm text-gray-300">
          Posts queued for automatic publishing
        </p>
      </div>


      <div className="p-6">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            {/* Table Head */}
            <thead>
              <tr className="border-b border-border">

                <th className="pb-3 font-semibold text-muted-foreground">
                  Content
                </th>

                <th className="pb-3 font-semibold text-muted-foreground">
                  Platform
                </th>

                <th className="pb-3 font-semibold text-muted-foreground">
                  Scheduled At
                </th>

                <th className="pb-3 font-semibold text-muted-foreground">
                  Status
                </th>

                <th className="pb-3 font-semibold text-muted-foreground">
                  Actions
                </th>

              </tr>
            </thead>


            {/* Table Body */}
            <tbody>

              {posts.map((post) => (

                <tr
                  key={post.id}
                  className="border-b border-border/50 last:border-0 hover-row"
                >

                  {/* Content */}
                  <td className="py-3.5 font-medium text-foreground">
                    {post.content}
                  </td>


                  {/* Platform */}
                  <td className="py-3.5 text-muted-foreground">
                    {post.platform}
                  </td>


                  {/* Scheduled Time */}
                  <td className="py-3.5 text-muted-foreground">
                    {new Date(post.scheduled_at).toLocaleString()}
                  </td>


                  {/* Status */}
                  <td className="py-3.5">

                    <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-yellow-700">
                      {post.status || "pending"}
                    </span>

                  </td>


                  {/* Actions */}
                  <td className="py-3.5 flex items-center gap-2">

                    <button
                      onClick={() =>
                        navigate(`/scheduled/${post.id}/edit`)
                      }
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition text-blue-700"
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={() => handleCancel(post.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition text-red-500"
                    >
                      Cancel
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* Empty State */}
        {posts.length === 0 && (

          <p className="py-8 text-center text-muted-foreground">
            No scheduled posts yet.
          </p>

        )}

      </div>

    </div>
  );
};

export default Scheduled;