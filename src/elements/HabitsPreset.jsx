import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import styles from "@/ui/tracker.module.css";
export default function HabitsPreset() {
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "habits_presets");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPresets(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {presets?.map((preset) => (
        <div className={styles.additional} key={preset?.id}>
          {preset?.title}
        </div>
      ))}
    </>
  );
}
