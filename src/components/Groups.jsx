import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";

export default function Groups() {
  const { user } = AuthContext();

  const usersCollection = collection(db, "users");
  const groupsCollection = collection(db, "groups");

  const [groupToAddId, setGroupToAddId] = useState("");
  const [groupHabits, setGroupHabits] = useState([]);

  const addToGroup = async () => {
    const groupDocReference = doc(groupsCollection, groupToAddId);
    const groupDoc = await getDoc(groupDocReference);

    if (!groupDoc.exists()) {
      console.log("Group does not exist");
      return;
    }

    const groupUsers = groupDoc.data().users;

    groupUsers.push(doc(usersCollection, user.user.uid));
    await updateDoc(groupDocReference, { users: groupUsers });
  };

  useEffect(() => {
    const userGroupsQuery = query(
      groupsCollection,
      where("users", "array-contains", doc(usersCollection, user.user.uid))
    );

    const unsubscribe = onSnapshot(userGroupsQuery, (userGroups) => {
      const habits = [];

      userGroups.docs.forEach(async (groupDoc) => {
        const groupData = groupDoc.data();
        const habitRefs = groupData.habits;
        console.log(habitRefs);
        const habitPromises = habitRefs.map((habitRef) => {
          const habitSnap = getDoc(habitRef);

          const habitData = habitSnap.data();

          return habitData;
        });

        const habitData = await Promise.all(habitPromises);

        habits.push(...habitData);
      });

      setGroupHabits(habits);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="groupHabits">
        {groupHabits.map((habitDoc) => (
          <a href={habitDoc.url}>{habitDoc.name}</a>
        ))}
      </div>
      <input onChange={(event) => setGroupToAddId(event.target.value)} />
      <Button onClick={addToGroup}>Добавиться в группу</Button>
    </>
  );
}
