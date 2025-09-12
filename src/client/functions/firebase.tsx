import { collection, addDoc, getFirestore, getDocs, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import moment, { months } from 'moment';

import app from './../firebase';
import _ from 'lodash';

const base = getFirestore(app);

export const addEmailToList = async (email: string) => {
  await setDoc(doc(base, 'orders', email), { email });
};
