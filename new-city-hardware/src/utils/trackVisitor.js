import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';

export const trackVisitor = async () => {
  try {
    const now = new Date();
    const day = format(now, 'yyyy-MM-dd');
    const month = format(now, 'yyyy-MM');

    const ref = doc(db, 'siteStats', 'visitors');
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      await updateDoc(ref, {
        [`daily.${day}`]: (data.daily?.[day] || 0) + 1,
        [`monthly.${month}`]: (data.monthly?.[month] || 0) + 1,
      });
    } else {
      await setDoc(ref, {
        daily: { [day]: 1 },
        monthly: { [month]: 1 },
      });
    }
  } catch (err) {
    console.error("Error tracking visitor:", err);
  }
};
