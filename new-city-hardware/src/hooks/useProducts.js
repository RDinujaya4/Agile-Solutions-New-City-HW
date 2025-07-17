import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export default function useProducts(filters) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let allProducts = [];

        const productCategoriesSnapshot = await getDocs(collection(db, 'products'));

        for (const doc of productCategoriesSnapshot.docs) {
          const categoryName = doc.id;
          const itemsRef = collection(db, 'products', categoryName, 'items');

          let q = query(itemsRef);

          if (filters.brand && filters.brand !== 'All Brands') {
            q = query(q, where('brand', '==', filters.brand));
          }

          if (filters.price) {
            if (filters.price === 'Under $50') {
              q = query(q, where('price', '<', 50));
            } else if (filters.price === '$50–$100') {
              q = query(q, where('price', '>=', 50), where('price', '<=', 100));
            }
          }

          if (filters.sort === 'Newest') {
            q = query(q, orderBy('createdAt', 'desc'));
          } else if (filters.sort === 'Featured') {
            q = query(q, where('featured', '==', true));
          }

          if (filters.category && filters.category !== 'All Products' && filters.category !== categoryName) {
            continue; // Skip this category
          }

          const itemsSnapshot = await getDocs(q);
          const categoryProducts = itemsSnapshot.docs.map(itemDoc => ({
            id: itemDoc.id,
            ...itemDoc.data(),
          }));

          allProducts = [...allProducts, ...categoryProducts];
        }

        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading };
}
