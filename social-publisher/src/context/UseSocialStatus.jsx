import { useEffect, useState } from "react";
import { getSocialStatus } from "../api/posts";

export default function useSocialStatus() {

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState({
    linkedin: false,
    instagram: false
  });

  const [hasAnyAccount, setHasAnyAccount] = useState(false);

  useEffect(() => {

    async function fetchStatus() {

      try {

        const res = await getSocialStatus();

        setStatus(res);

        setHasAnyAccount(
          res.linkedin || res.instagram
        );

      } catch {

        setStatus({
          linkedin: false,
          instagram: false
        });

        setHasAnyAccount(false);
      }

      setLoading(false);
    }

    fetchStatus();

  }, []);

  return {
    loading,
    status,
    hasAnyAccount
  };
}