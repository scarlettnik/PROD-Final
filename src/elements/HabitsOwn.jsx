import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import styles from "@/ui/tracker.module.css";
import { Checkbox } from "@mui/material";
import { Check, CheckCheck } from "lucide-react";

export default function HabitsOwn() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "habits");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setHabits(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);

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
  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <>
      <p className={styles.title}>Ваши привычки</p>
      <div>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th></th>
              {daysOfWeek.map((day) => (
                <th className={styles.date} key={day}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category) => (
              <React.Fragment key={category}>
                {groupedHabits[category] &&
                  groupedHabits[category].length > 0 && (
                    <>
                      <tr>
                        <th className={styles.category} colSpan={8}>
                          {periodLabels[category]}
                        </th>
                      </tr>
                      {groupedHabits[category].map((habit) => (
                        <tr className={styles.calendar} key={habit.id}>
                          <td className={styles.selector}>{habit.title}</td>
                          {daysOfWeek.map((day) => (
                            <td className={styles.checkbox} key={day}>
                              {habit.value ? (
                                <input
                                  className={styles.inputNumber}
                                  type="number"
                                  value={habits.value}
                                />
                              ) : (
                                <Checkbox 
                                  icon={<Check className={styles.icon} style={{ color: "white" }} />}
                                  checkedIcon={<CheckCheck className={styles.icon} />}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
