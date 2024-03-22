'use client'

import { db } from "@/services/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from '@/ui/shop.module.css'
import { Button } from "@mui/material";

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
   {products?.map((product) => (
    <div className={styles.card} key={product?.id}>
      {product?.title}
      <button className={styles.buyButton}>Купить за {product?.cost}</button>
    </div>
  ))}
   </div>
   </>
   
  )
}
