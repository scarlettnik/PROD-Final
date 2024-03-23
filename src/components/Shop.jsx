'use client'

import { db } from "@/services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from '@/ui/shop.module.css'

export default function Shop() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "shop");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setProducts(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);
  return (<>
   <div>Shop</div>
   <div className={styles.cardList}>
   <div className={styles.card}>
      Увеличение максимального количества групп на 3
      <button className={styles.buyButton}>Купить за 3</button>
    </div>
    <div className={styles.card}>
    Увеличение максимального количества привычек на 3
      <button className={styles.buyButton}>Купить за 5</button>
    </div>
    <div className={styles.card}>
      Изменение стилей на главном экране
      <button className={styles.buyButton}>Купить за 7</button>
    </div>
    </div>
   </>
   
  )
}
