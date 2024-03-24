'use client'
import React, { useState } from "react";
import { UserContext } from "@/provider/UserProvider";
import { Button, Modal, Box } from "@mui/material";
import styles from '@/ui/modal.module.css'
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";

const Maraphones = () => {
  const {user} = AuthContext()
  const maraphonesCollection = collection(db, "maraphones");
  const [open, setOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    title: "",
    category: "",
    period: "",
    targetValue: null,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const addTrueFalseHabit = async () => {
    await addDoc(maraphonesCollection, {
      creator: user.user.uid, 
      addDate: new Date(),
      title: habitData.title,
      category: habitData.category,
      period: habitData.period,
      targetValue: habitData.targetValue,
      actions: [
        {
          date: new Date(),
          progress: 0,
          user: user.user.uid,
        },
      ],
    });
  };
  return (
    <div>
    <Modal open={open} onClose={handleClose}>
    <Box className={styles.box}>
          <input
            onChange={(event) =>
              setHabitData((prevState) => ({
                ...prevState,
                title: event.target.value,
              }))
            }
          />
          <br />
          <input
            onChange={(event) =>
              setHabitData((prevState) => ({
                ...prevState,
                category: event.target.value,
              }))
            }
          />
          <br />
          <input
            onChange={(event) =>
              setHabitData((prevState) => ({
                ...prevState,
                period: event.target.value,
              }))
            }
          />
          <br />
          <input
            placeholder="По желанию добавьте цель"
            onChange={(event) =>
              setHabitData((prevState) => ({
                ...prevState,
                targetValue: parseInt(event.target.value),
              }))
            }
          />
          <br />
          <Button variant="contained" onClick={addTrueFalseHabit}>
            Добавить привычку
          </Button>
        </Box>
    </Modal>
    <Button onClick={handleOpen}>Добавить марафон</Button>
  </div>
  );
};

export default Maraphones;
