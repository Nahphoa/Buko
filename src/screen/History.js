import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const History = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setBookings([]);
          return;
        }

        const q = query(collection(db, "Booking"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ticket_id: doc.id,
            ...data
          };
        });

        setBookings(fetched);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = (ticketId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this history item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Booking", ticketId));
              setBookings(prev => prev.filter(item => item.ticket_id !== ticketId));
            } catch (error) {
              console.error("Error deleting booking:", error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.ticket}>
      <View style={styles.sideLabel}>
        <Text style={styles.sideText}>Buko</Text>
      </View>

      <View style={styles.detailsSection}>
        {(item.busName || item.busNumber) && (
          <Text style={styles.text}>
            <Text style={styles.bold}>Bus: </Text>
            {item.busName ? item.busName : ""} {item.busNumber ? `(${item.busNumber})` : ""}
          </Text>
        )}

        <Text style={styles.name}>
          <Text style={styles.bold}>Name: </Text>{item.username} ({item.gender}, {item.age})
        </Text>
        <Text style={styles.text}>
          Travel Date: <Text style={styles.bold}>{item.travelDate}</Text>
        </Text>
        <Text style={styles.text}>
          Boarding Time: <Text style={styles.bold}>09.00 AM</Text>
        </Text>
        <Text style={styles.seat}>
          Seat <Text style={styles.seatNumber}>{item.seatNumber}</Text>
        </Text>
        <Text style={styles.text}>
          Status: <Text style={{ fontWeight: 'bold', color: item.status === 'cancelled' ? 'red' : 'green' }}>
            {item.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
          </Text>
        </Text>

        <Text style={styles.deleteButton} onPress={() => handleDelete(item.ticket_id)}>
          🗑️ Delete
        </Text>
      </View>

      <View style={styles.routeSection}>
        <Text style={styles.textSmall}>From</Text>
        <Text style={styles.bold}>{item.from || "N/A"}</Text>
        <Text style={styles.textSmall}>To</Text>
        <Text style={styles.bold}>{item.to || "N/A"}</Text>
        <Text style={styles.dashed}>----------------------</Text>
        <Text style={styles.textSmall}>Booking Date</Text>
        <Text style={styles.bold}>{item.bookingDate || "N/A"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.ticket_id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No bookings found.</Text>}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  ticket: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sideLabel: {
    backgroundColor: '#5a66a4',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    padding: 10,
  },
  sideText: {
    color: '#fff',
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    fontSize: 16,
  },
  detailsSection: {
    flex: 2,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    marginBottom: 2,
  },
  seat: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatNumber: {
    fontSize: 18,
    color: '#3b2d0d',
  },
  routeSection: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashed: {
    fontSize: 12,
    color: '#000',
    marginVertical: 6,
  },
  textSmall: {
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#e53935',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
