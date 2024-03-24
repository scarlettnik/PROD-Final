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
import Loader from "@/elements/Loader";

export default function Groups() {
  const { user } = AuthContext();

  const usersCollection = collection(db, "users");
  const groupsCollection = collection(db, "groups");

  const [groupToAddId, setGroupToAddId] = useState("");
  const [groupHabits, setGroupHabits] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const addToGroup = async () => {
    const groupDocReference = doc(groupsCollection, groupToAddId);
    const groupDoc = await getDoc(groupDocReference);

    if (!groupDoc.exists()) {
      console.log("Group does not exist");
      return;
    }

    const groupUsers = groupDoc.data().users;
    const currentUser = doc(usersCollection, user.user.uid);

    if (!groupUsers.includes(currentUser))
      groupUsers.push(currentUser);
    await updateDoc(groupDocReference, { users: groupUsers });
  };

  useEffect(() => {
    const userGroupsQuery = query(
      groupsCollection,
      where("users", "array-contains", doc(usersCollection, user?.user?.uid))
    );
  
    const unsubscribe = onSnapshot(userGroupsQuery, async (userGroups) => {
      const updatedGroupHabits = [];
  
      for (const groupDoc of userGroups.docs) {
        const groupData = groupDoc.data();
  
        for (const habitDocReference of groupData.habits) {
          const currentHabitData = {
            group: groupData,
            habit: (await getDoc(habitDocReference)).data(),
          };
  
          if (
            !updatedGroupHabits.some(
              (item) =>
                item.group === currentHabitData.group &&
                item.habit === currentHabitData.habit
            )
          ) {
            updatedGroupHabits.push(currentHabitData);
          }
        }
      }
  
      setGroupHabits(updatedGroupHabits);
      setIsLoaded(true);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {
        isLoaded ? (
          <div className="groupHabits" key="groupHabits">
            {
              groupHabits.map((item, index) => (
                <p key={item["habit"]._key + index.toString()}>{item["group"].title}: {item["habit"].title}</p>
              ))
            }
          </div>
        ) : <Loader/>
      }
      <input onChange={(event) => setGroupToAddId(event.target.value)} />
      <Button onClick={addToGroup}>Добавиться в группу</Button>
    </>
  );
}
