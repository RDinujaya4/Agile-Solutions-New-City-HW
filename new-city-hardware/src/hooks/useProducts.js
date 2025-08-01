import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  collectionGroup,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function useProducts(filters) {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandUnsub = onSnapshot(
      collectionGroup(db, 'items'),
      (snapshot) => {
        const brandSet = new Set();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.brand) brandSet.add(data.brand);
        });
        setBrands(['All Brands', ...Array.from(brandSet).sort()]);
      },
      (err) => {
        console.error("Error fetching brands:", err);
      }
    );

    return () => brandUnsub();
  }, []);

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

          if (filters.price === 'Under Rs.5000') {
            q = query(q, where('price', '<', 5000));
          } else if (filters.price === 'Rs.5000–Rs.10000') {
            q = query(q, where('price', '>=', 5000), where('price', '<=', 10000));
          } else if (filters.price === 'Above Rs.10000') {
            q = query(q, where('price', '>', 10000));
          }

          if (filters.sort === 'Newest') {
            q = query(q, orderBy('createdAt', 'desc'));
          } else if (filters.sort === 'Featured') {
            q = query(q, where('featured', '==', true));
          }

          if (filters.category && filters.category !== 'All Products' && filters.category !== categoryName) {
            continue;
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

  return { products, brands, loading };
}
