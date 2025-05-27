import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarComponent = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    onSelectDate(day.dateString);
    setModalVisible(false); // Close modal after selecting a date
  };

  return (
    <View>
      {/* Date Input Field */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.input}
          placeholder="Date of Travel (DD/MM/YYYY)"
          value={selectedDate}
          
          editable={false} // Read-only, user taps to open calendar
        />
      </TouchableOpacity>

      {/* Calendar Popup Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide" // Smooth sliding animation
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Calendar Component */}
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={
                selectedDate
                  ? { [selectedDate]: { selected: true, selectedColor: "#007bff" } }
                  : {}
              }
              minDate={new Date().toISOString().split("T")[0]} // Disable past dates
            />
            
            {/* Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 49,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 7,
    paddingHorizontal: 55,
    width: 385,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent dark background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#800080",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    
  },
});

export default CalendarComponent;