'use client';

import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {collection, doc, getDoc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {db} from "@/services/firebase";
import {AuthContext} from "@/provider/AuthProvider";

export default function Groups() {
  const { user } = AuthContext();

  const usersCollection = collection(db, "users");
  const groupsCollection = collection(db, "groups");

  const [groupToAddId, setGroupToAddId] = useState("");

  const addToGroup = async () => {
    const groupDocReference = doc(groupsCollection, groupToAddId)
    const groupDoc = await getDoc(groupDocReference)

    if (!groupDoc.exists()) {
      console.log("Group does not exist");
      return;
    }

    const groupUsers = groupDoc.data().users;

    groupUsers.push(doc(usersCollection, user.user.uid));
    await updateDoc(groupDocReference, {users: groupUsers});
  };

  useEffect( () => {
    const userGroupsQuery = query(
      groupsCollection, where("users", "array-contains", doc(usersCollection, user.user.uid))
    );
    const groupHabits = [];

    onSnapshot(userGroupsQuery, (userGroups) => {
      console.log(userGroups.docs[1].data());
      userGroups.docs.forEach((groupDoc) => {
        groupDoc.data().habits.forEach((habit) => {groupHabits.push(habit)});
      });
    });

    console.log(groupHabits);
  }, []);

  return (
    <>
      <div className="groupHabits">
        {/*{*/}
        {/*  groupHabits.map((habitDoc))*/}
        {/*}*/}
      </div>
      <input
        onChange={(event) => { setGroupToAddId(event.target.value) }}
      />
      <Button onClick={addToGroup}>Добавиться в группу</Button>
    </>
  )
}
