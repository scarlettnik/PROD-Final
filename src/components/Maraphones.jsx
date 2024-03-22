'use client'
import React, { useContext } from "react";
import { UserContext } from "@/provider/UserProvider";

const Maraphones = () => {
  const userData = useContext(UserContext);
  console.log(userData)
  return (
    <div>
    {userData ? (
      <div>
        {userData.map((user) => (
          <div key={user?.id}>
            {user?.email}
            <p>{user?.level}</p>
            <p>{user?.wallet}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>No user data available</p>
    )}
  </div>
  );
};

export default Maraphones;
