import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');

  const busesCollectionRef = collection(db, 'buses');

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  const getBuses = useCallback(async () => {
    const data = await getDocs(busesCollectionRef);
    setBuses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  });

  const addBus = async () => {
    if (busName && busNumber) {
      await addDoc(busesCollectionRef, { name: busName, number: busNumber });
      setBusName('');
      setBusNumber('');
      getBuses();
    }
  };

  const deleteBus = async (id) => {
    const busDoc = doc(db, 'buses', id);
    await deleteDoc(busDoc);
    getBuses();
  };

  useEffect(() => {
    getBuses();
  }, [getBuses]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Buses</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Bus Name"
          value={busName}
          onChange={(e) => setBusName(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Bus Number"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={addBus} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Bus
        </button>
      </div>

      <ul>
        {buses.map((bus) => (
          <li key={bus.id} className="flex justify-between items-center border-b py-2">
            <div>
              <strong>{bus.name}</strong> — {bus.number}
            </div>
            <button
              onClick={() => deleteBus(bus.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageBuses;
