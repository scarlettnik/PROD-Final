import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import HabitsPreset from "@/elements/HabitsPreset";
import styles from "@/elements/modal/modal.module.css";
import SelectCategory from "@/style/Select";
import TitleField from "@/style/TitleField";
import { db } from "@/services/firebase";
import { collection } from "firebase/firestore";

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const [ModalTrueFalseOpen, setModalTrueFalseOpen] = useState(false);
  const [ModalCountOpen, setModalCountOpen] = useState(false);
  const [ModalPopularOpen, setModalPopularOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleModalTrueFalseOpen = () => {
    setOpen(false);
    setModalTrueFalseOpen(true);
  };
  const handleModalTrueFalseClose = () => setModalTrueFalseOpen(false);
  const handleModalCountOpen = () => {
    setOpen(false);
    setModalCountOpen(true);
  };
  const handleModalCountClose = () => setModalCountOpen(false);
  const handleModalPopularOpen = () => {
    setOpen(false);
    setModalPopularOpen(true);
  };
  const handleModalPopularClose = () => setModalPopularOpen(false);



    const data = ["Привычка 1", "Привычка 2", "Привычка 3"];

    const Push = () => {
      db.ref("habits").set({
          data: data
      }).catch(alert);
  }
  
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
            Да / Нет
          </Button>
          <br />
          <Button
            variant="outlined"
            style={{ width: "100%" }}
            onClick={handleModalCountOpen}
          >
            Количественные
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
    <Button
            variant="outlined"
            style={{ width: "100%" }}
            onClick={Push}
          >
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
          <TitleField label="Название" />
          <SelectCategory />
          <Button variant="contained">Добавить привычку</Button>
        </Box>
      </Modal>

      <Modal open={ModalCountOpen} onClose={handleModalCountClose}>
        <Box className={styles.box}>
          <TitleField label="Название" />
          <TitleField label="Цель" type="number" />
          <SelectCategory />
          <Button variant="contained">Добавить привычку</Button>
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
