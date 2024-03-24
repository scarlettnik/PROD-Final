import React, { useEffect, useState, useCallback } from "react";
import { Checkbox } from "@mui/material";
import { Check, CheckCheck } from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/tracker.module.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useCookies } from "react-cookie";

const HabitsOwn = () => {
  const { user } = AuthContext();
  const [habits, setHabits] = useState([]);
  const [habitData, setHabitData] = useState({});
  const currentDate = new Date();
  const [cookies, setCookie] = useCookies(["habitData"]);

  useEffect(() => {
    const storedHabitData = cookies.habitData || {};
    setHabitData(storedHabitData);
  }, []);

  useEffect(() => {
    setCookie("habitData", habitData);
  }, []);

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
        if (habit.user === user?.user?.uid && habit.days) {
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
  }, [user]);

  const onChangeCheckbox = useCallback((habitId, day, value) => {
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

  return (
    <>
      <p className={styles.title}>Ваши привычки</p>
      <div>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th></th>
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date(currentDate.getTime());
                date.setDate(currentDate.getDate() + index);
                const formattedDate = date.toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });
                return (
                  <th className={styles.date} key={formattedDate}>
                    {formattedDate}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((targetValue) => {
              const shouldDisplaytargetValue = groupedHabits[targetValue]?.some(
                (habit) => habit.user === user?.user?.uid
              );

              return (
                <React.Fragment key={targetValue}>
                  {shouldDisplaytargetValue && (
                    <>
                      <tr>
                        <th className={styles.category} colSpan={8}>
                          {periodLabels[targetValue]}
                        </th>
                      </tr>
                      {groupedHabits[targetValue].map((habit) => {
                        if (habit.user === user?.user?.uid) {
                          const habitId = habit.id;
                          const habitCheckboxValues =
                            habitData[habitId]?.days || {};

                          return (
                            <tr className={styles.calendar} key={habitId}>
                              <td className={styles.selector}>{habit.title}</td>
                              {Array.from({ length: 7 }).map((_, index) => {
                               
                                const checkboxValue =
                                habitCheckboxValues[index] || "";
  


                                if (habit.targetValue) {
                                  return (
                                    <td className={styles.checkbox} key={index}>
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
                                    <td className={styles.checkbox} key={index}>
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