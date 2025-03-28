"use client";

import { useEffect, useState } from "react";
import { UserMenager } from "@/services/UserMenager";

interface User {
  id: string;
  name: string;
  surname: string;
  role: string;
}
const UserProfile = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = UserMenager.getLoggedInUser();
    if (user) setLoggedInUser(user);
    setLoading(false);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div className="user-profile">
      {loading ? (
        <p>Loading...</p>
      ) : loggedInUser ? (
        <p>
          Logged in as: {loggedInUser.name} {loggedInUser.surname} (
          {loggedInUser.role})
        </p>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

export default UserProfile;
