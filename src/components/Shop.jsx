"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { AuthContext } from "@/provider/AuthProvider";
import styles from "@/ui/shop.module.css";
import { UserContext } from "@/provider/UserProvider";
import { useContext } from "react";

export default function Shop() {
  const { user } = AuthContext();
  const currentUser = useContext(UserContext);
  const userDocReference = doc(db, "users", user.user.uid);
  const wallet = currentUser[0].wallet
  const updateMaxGroup = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newMaxGroup = userData.maxGroup + 3;
    const newWallet = userData.wallet - 3;
    await updateDoc(userDocReference, {
      ...userData,
      maxGroup: newMaxGroup,
      wallet: newWallet,
    });

    console.log("Данные пользователя успешно обновлены.");
  };

  const updateMaxHabbit = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newMaxHabbit = userData.maxHabbit + 5;
    const newWallet = userData.wallet - 3;
    await updateDoc(userDocReference, {
      ...userData,
      maxHabit: newMaxHabbit,
      wallet: newWallet,
    });

    console.log("Данные пользователя успешно обновлены.");
  };

  const addTheme = async () => {
    const userDoc = await getDoc(userDocReference);
    const userData = userDoc.data();
    const newWallet = userData.wallet - 5;
    await updateDoc(userDocReference, {
      ...userData,
      customTheme: true,
      wallet: newWallet,
    });

    console.log("Данные пользователя успешно обновлены.");
  };

  return (
    <>
     
      <div>Shop</div>
      <div className={styles.cardList}>
        <div className={styles.card}>
          Увеличение максимального количества групп на 3
          <button
            onClick={updateMaxGroup}
            className={styles.buyButton}
            disabled={wallet - 3 <= 0}
          >
            {wallet - 3 > 0 ? "Купить за 3" : "Недостаточно средств"}
          </button>
        </div>
        <div className={styles.card}>
          Увеличение максимального количества привычек на 5
          <button
            onClick={updateMaxHabbit}
            className={styles.buyButton}
            disabled={wallet - 3 <= 0}
          >
            {wallet - 3 > 0 ? "Купить за 5" : "Недостаточно средств"}
          </button>
        </div>
        <div className={styles.card}>
          Изменение стилей на главном экране
          <button
            onClick={addTheme}
            className={styles.buyButton}
            disabled={wallet - 5 <= 0 || currentUser[0].customTheme}
          >
            {currentUser[0].customTheme ? "Уже куплено" : wallet - 5 > 0 ? "Купить за 5" : "Недостаточно средств"}
          </button>
        </div>
      </div>
   
  
    </>
  );
}
