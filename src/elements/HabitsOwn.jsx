import React, { useEffect, useState, useCallback } from "react";
import { Checkbox } from "@mui/material";
import { Check, CheckCheck } from "lucide-react";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/tracker.module.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HabitsOwn = () => {
  const { user } = AuthContext();
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedWeekdays, setDisplayedWeekdays] = useState([]);
  const [habitData, setHabitData] = useState(() => {
    const storedData = localStorage.getItem("habitData");
    return storedData !== null ? JSON.parse(storedData) : {};
  });

  const currentDate = new Date();
  useEffect(() => {
    if (!user) return;

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
          const habitId = habit.id;
          const storedData = localStorage.getItem(habitId);
          const storedDays = storedData !== null ? JSON.parse(storedData) : {};
          const currentDate = new Date();
          const currentDateString = currentDate.toISOString().split("T")[0];

          if (!storedDays[currentDateString]) {
            storedDays[currentDateString] = "";
            localStorage.setItem(habitId, JSON.stringify(storedDays));
          }

          newHabitData[habitId] = {
            days: storedDays,
            input: storedDays[currentDateString] || "",
          };
        }
      });
      setHabitData(newHabitData);
    };

    fetchData();
  }, [user]);

  const onChangeCheckbox = useCallback((habitId, day, value) => {
    setHabitData((prevData) => {
      const newData = {
        ...prevData,
        [habitId]: {
          ...prevData[habitId],
          days: {
            ...prevData[habitId]?.days,
            [day]: value,
          },
        },
      };
      localStorage.setItem(habitId, JSON.stringify(newData[habitId]?.days));
      return newData;
    });
  }, [habitData]);

  useEffect(() => {
    localStorage.setItem("habitData", JSON.stringify(habitData));
    console.log(localStorage.habitData);
  }, [habitData]);

  const groupedHabits = habits.reduce((acc, habit) => {
    const { category } = habit;
    if (acc[category]) {
      acc[category].push(habit);
    } else {
      acc[category] = [habit];
    }
    return acc;
  }, {});
  const updateDisplayedWeekdays = (selectedDate) => {
    const weekdays = [];
    const currentDate = new Date(selectedDate.getTime());
  
    for (let i = 0; i < 7; i++) {
      currentDate.setDate(selectedDate.getDate() + i);
      const formattedDate = currentDate.toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      weekdays.push(formattedDate);
    }
  
    setDisplayedWeekdays(weekdays);
  };
  const sortedCategories = ["daily", "weekly", "monthly"];
  const periodLabels = {
    daily: "Каждый день",
    weekly: "Каждую неделю",
    monthly: "Каждый месяц",
  };

  return (
    <>
    <DatePicker
  selected={selectedDate}
  onChange={(date) => {
    setSelectedDate(date);
    updateDisplayedWeekdays(date);
  }}
/>
      <p className={styles.title}>Ваши привычки</p>
     
      <div>
        <table className={styles.table}>
        <thead className={styles.thead}>
  <tr>
    <th></th>
    {Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(selectedDate.getTime());
      date.setDate(selectedDate.getDate() + index);
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
                                        checked={checkboxValue === true}
                                        onChange={(event) =>
                                          onChangeCheckbox(
                                            habitId,
                                            index,
                                            event.target.checked ? true : false
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
