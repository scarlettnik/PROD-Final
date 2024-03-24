import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import HabitsPreset from "@/elements/HabitsPreset";
import styles from "@/ui/modal.module.css";
import { db } from "@/services/firebase";
import { collection, doc, addDoc } from "firebase/firestore";
import { AuthContext } from "@/provider/AuthProvider";

export default function AddHabit() {
  const { user } = AuthContext();
  const habitsCollection = collection(db, "habits");
  const [open, setOpen] = useState(false);
  const [ModalTrueFalseOpen, setModalTrueFalseOpen] = useState(false);
  const [ModalPopularOpen, setModalPopularOpen] = useState(false);
  const [habitData, setHabitData] = useState({
    title: "",
    category: "",
    period: "",
    targetValue: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleModalTrueFalseOpen = () => {
    setOpen(false);
    setModalTrueFalseOpen(true);
  };
  const handleModalTrueFalseClose = () => setModalTrueFalseOpen(false);
  const handleModalPopularOpen = () => {
    setOpen(false);
    setModalPopularOpen(true);
  };
  const handleModalPopularClose = () => setModalPopularOpen(false);

  const addTrueFalseHabit = async () => {
    await addDoc(habitsCollection, {
      user: user.user.uid,
      addDate: new Date(),
      title: habitData.title,
      category: habitData.category,
      period: habitData.period,
      targetValue: habitData.targetValue,
      actions: [
        {
          date: new Date(),
          progress: 0,
          user: userDoc,
        },
      ],
    });
  };

  return (
    <div>
      <Button onClick={handleOpen}>Добавить</Button>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.box}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Вы можете добавить привычки
          </Typography>

          <Button
            variant="outlined"
            style={{ width: "100%" }}
            onClick={handleModalTrueFalseOpen}
          >
            Своя привычка
          </Button>
          <br />
          <Button
            variant="outlined"
            style={{ width: "100%" }}
            onClick={handleModalPopularOpen}
          >
            Популярные
          </Button>
          <br />
          <Button variant="outlined" style={{ width: "100%" }}>
            Тестовые привычки от автора
          </Button>
          <br />
          <Button
            variant="outlined"
            style={{ width: "100%" }}
            onClick={() => console.log("Button 4 clicked")}
          >
            Свои тестовые
          </Button>
        </div>
      </Modal>
      <Modal open={ModalTrueFalseOpen} onClose={handleModalTrueFalseClose}>
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
      <Modal open={ModalPopularOpen} onClose={handleModalPopularClose}>
        <Box className={styles.box}>
          <Typography variant="h6" component="h2">
            Добавить
          </Typography>
          <HabitsPreset />
        </Box>
      </Modal>
    </div>
  );
}
