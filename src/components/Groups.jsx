import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";
import Loader from "@/elements/Loader";
import {Modal} from "@mui/material";
import Box from "@mui/material/Box";
import styles from '@/ui/modal.module.css'

export default function Groups() {
  const { user } = AuthContext();

  const usersCollection = collection(db, "users");
  const groupsCollection = collection(db, "groups");
  const habitsCollection = collection(db, "habits");
  const currentUser = doc(usersCollection, user.user.uid);

  const [groupHabits, setGroupHabits] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewGroupAdded, setIsNewGroupAdded] = useState(false);
  const [groupToAddId, setGroupToAddId] = useState("");
  const [newGroupData, setNewGroupData] = useState(
    {
      title: "",
      habits: [
        {
          title: "",
          category: "",
          period: "",
          targetValue: null,
        }
      ],
      users: [currentUser],
    }
  );

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setNewGroupData(
      {
        title: "",
        habits: [
          {
            title: "",
            category: "",
            period: "",
            targetValue: null,
          }
        ],
        users: [currentUser],
      }
    )

    setIsModalOpen(false);
  }

  const addToGroup = async () => {
    const groupDocReference = doc(groupsCollection, groupToAddId);
    const groupDoc = await getDoc(groupDocReference);

    if (!groupDoc.exists()) {
      console.log("Group does not exist");
      return;
    }

    const groupUsers = groupDoc.data().users;

    if (!groupUsers.includes(currentUser))
      groupUsers.push(currentUser);
    await updateDoc(groupDocReference, { users: groupUsers });
  };

  const newGroup = async () => {
    const habitDocReferences = [];
    for (const habitData of newGroupData.habits) {
      habitDocReferences.push(await addDoc(habitsCollection, habitData));
    }
    newGroupData.habits = habitDocReferences;

    await addDoc(groupsCollection, newGroupData);

    handleModalClose();
    setIsNewGroupAdded(true);
    setIsNewGroupAdded(false);
    setIsLoaded(false);
  }

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
  }, [isNewGroupAdded]);

  return (
    <>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box className={styles.box}>
          <input
            onChange={(event) =>
              setNewGroupData((prevState) => ({
                ...prevState,
                title: event.target.value,
              }))
            }
          />
          <br/>
          {
            newGroupData.habits.map((_, index) => (
              <>
                <br/>
                <div key={`habit-${index}`}>
                  <input
                    type="text"
                    onChange={
                      (event) => {
                        const habitsCopy = [...newGroupData.habits];
                        habitsCopy[index].title = event.target.value;
                        setNewGroupData((prevState) => ({
                          ...prevState,
                          habits: habitsCopy,
                        }))
                      }
                    }
                  />
                  <br/>
                  <input
                    type="text"
                    onChange={
                      (event) => {
                        const habitsCopy = [...newGroupData.habits];
                        habitsCopy[index].category = event.target.value;
                        setNewGroupData((prevState) => ({
                          ...prevState,
                          habits: habitsCopy,
                        }))
                      }
                    }
                  />
                  <br/>
                  <input
                    type="text"
                    onChange={
                      (event) => {
                        const habitsCopy = [...newGroupData.habits];
                        habitsCopy[index].period = event.target.value;
                        setNewGroupData((prevState) => ({
                          ...prevState,
                          habits: habitsCopy,
                        }))
                      }
                    }
                  />
                  <br/>
                  <input
                    type="number"
                    placeholder="По желанию добавьте цель"
                    onChange={
                      (event) => {
                        const habitsCopy = [...newGroupData.habits];
                        habitsCopy[index].targetValue = event.target.value;
                        setNewGroupData((prevState) => ({
                          ...prevState,
                          habits: habitsCopy,
                        }))
                      }
                    }
                  />
                </div>
              </>
            ))
          }
          <br/>
          <button type="button" onClick={
            () => {
              const habitsCopy = [...newGroupData.habits];
              habitsCopy.push(
                {
                  title: "",
                  category: "",
                  period: "",
                  targetValue: null,
                }
              );
              setNewGroupData((prevState) => ({
                ...prevState,
                habits: habitsCopy,
              }))
            }
          }>
            +
          </button>
          <br/>
          <br/>
          <Button variant="contained" onClick={newGroup}>
            Создать группу
          </Button>
        </Box>
      </Modal>
      {
        isLoaded ? (
          <div className="groupHabits" key="groupHabits">
            {
              groupHabits.map((item, index) => (
                <p key={item.habit._key + index.toString()}>{item.group.title}: {item.habit.title}</p>
              ))
            }
          </div>
        ) : <Loader/>
      }
      <input onChange={(event) => setGroupToAddId(event.target.value)} />
      <Button onClick={addToGroup}>Добавиться в группу</Button>
      <br/>
      <Button onClick={handleModalOpen}>Создать группу</Button>
    </>
  );
}
