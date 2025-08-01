import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'products'));
        const categoryList = [];

        for (const doc of categoriesSnapshot.docs) {
          const categoryName = doc.id;
          const itemsSnapshot = await getDocs(collection(db, 'products', categoryName, 'items'));

          categoryList.push({
            name: categoryName,
            items: itemsSnapshot.size,
          });
        }

        const totalItems = categoryList.reduce((sum, c) => sum + c.items, 0);
        setCategories([{ name: 'All Products', items: totalItems }, ...categoryList]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
