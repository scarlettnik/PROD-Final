import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { Check, CheckCheck } from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/tracker.module.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebase";

const HabitsOwn = () => {
  const { user } = AuthContext();
  const [habits, setHabits] = useState([]);
  const [habitData, setHabitData] = useState({});
  const currentDate = new Date();
  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  useEffect(() => {
    const storedHabitData = JSON.parse(localStorage.getItem("habitData")) || {};
    setHabitData(storedHabitData);
  }, []);
  console.log(habitData);

  useEffect(() => {
    localStorage.setItem("habitData", JSON.stringify(habitData));
  }, [habitData]);

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "habits");
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);
      const newHabits = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setHabits(newHabits);

      const newHabitData = {};
      newHabits.forEach((habit) => {
        if (habit.user === user.user.uid && habit.days) {
          newHabitData[habit.id] = {
            days: habit.days,
            input: "",
          };
        }
      });
      setHabitData((prevData) => ({
        ...prevData,
        ...newHabitData,
      }));
    };

    fetchData();
  }, []);

  const onChangeCheckbox = (habitId, day, value) => {
    setHabitData((prevData) => ({
      ...prevData,
      [habitId]: {
        ...prevData[habitId],
        days: {
          ...prevData[habitId]?.days,
          [day]: value,
        },
      },
    }));
  };

  const groupedHabits = habits.reduce((acc, habit) => {
    const { category } = habit;
    if (acc[category]) {
      acc[category].push(habit);
    } else {
      acc[category] = [habit];
    }
    return acc;
  }, {});

  const sortedCategories = ["daily", "weekly", "monthly"];
  const periodLabels = {
    daily: "Каждый день",
    weekly: "Каждую неделю",
    monthly: "Каждый месяц",
  };

  return (
    <>
      <p className={styles.title}>Ваши привычки</p>
      <div>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th></th>
              {daysOfWeek.map((day, index) => {
                const date = new Date(currentDate.getTime());
                date.setDate(currentDate.getDate() + index);
                return (
                  <th className={styles.date} key={day}>
                    {date.getDate()}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category) => {
              const shouldDisplayCategory = groupedHabits[category]?.some(
                (habit) => habit.user === user.user.uid
              );

              return (
                <React.Fragment key={category}>
                  {shouldDisplayCategory && (
                    <>
                      <tr>
                        <th className={styles.category} colSpan={8}>
                          {periodLabels[category]}
                        </th>
                      </tr>
                      {groupedHabits[category].map((habit) => {
                        if (habit.user === user.user.uid) {
                          const habitId = habit.id;
                          const habitCheckboxValues =
                            habitData[habitId]?.days || {};

                          return (
                            <tr className={styles.calendar} key={habitId}>
                              <td className={styles.selector}>{habit.title}</td>
                              {daysOfWeek.map((day, index) => {
                                const checkboxValue =
                                  habitCheckboxValues[index] || "";

                                if (habit.targetValue) {
                                  return (
                                    <td className={styles.checkbox} key={day}>
                                      <input
                                        className={styles.inputNumber}
                                        type="number"
                                        value={checkboxValue}
                                        onChange={(event) =>
                                          onChangeCheckbox(
                                            habitId,
                                            index,
                                            event.target.value
                                          )
                                        }
                                      />
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td className={styles.checkbox} key={day}>
                                      <Checkbox
                                        icon={
                                          <Check
                                            className={styles.icon}
                                            style={{ color: "white" }}
                                          />
                                        }
                                        checkedIcon={
                                          <CheckCheck className={styles.icon} />
                                        }
                                        checked={checkboxValue === 1}
                                        onChange={(event) =>
                                          onChangeCheckbox(
                                            habitId,
                                            index,
                                            event.target.checked ? 1 : 0
                                          )
                                        }
                                      />
                                    </td>
                                  );
                                }
                              })}
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HabitsOwn;
