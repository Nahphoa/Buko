import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentScreen = ({ route, navigation }) => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const { bookingData } = route.params || {};

  const {
    totalPrice = 0,
    selectedSeats = [],
    passengers = [],
    busName,
    from,
    to,
    travelDate,
  } = bookingData || {};

  const handleWebPayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      Alert.alert("Error", "Failed to load Razorpay SDK.");
      return;
    }

    const options = {
      key: "rzp_test_nmdAe8ZAjiKxhO",
      amount: totalPrice * 100,
      currency: "INR",
      name: "BookySeat",
      description: `Payment for seats: ${selectedSeats.join(", ")}`,
      image: "https://yourcompany.com/logo.png",
      handler: function (response) {
        setPaymentStatus("Payment Done ✅");
        setTimeout(() => {
          navigation.navigate("Home"); // ✅ go back to Home screen
        }, 1500);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9876543210",
      },
      theme: { color: "#800080" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePayment = () => {
    if (!totalPrice || totalPrice <= 0) {
      Alert.alert("Invalid Amount", "Total price must be greater than zero.");
      return;
    }

    if (Platform.OS === "web") {
      handleWebPayment();
      return;
    }

    const razorpayOptions = {
      description: `Payment for seats: ${selectedSeats.join(", ")}`,
      image: "https://yourcompany.com/logo.png",
      currency: "INR",
      key: "rzp_test_nmdAe8ZAjiKxhO",
      amount: totalPrice * 100,
      name: "BookySeat",
      prefill: {
        email: "customer@example.com",
        contact: "9876543210",
        name: "Customer Name",
      },
      theme: { color: "#800080" },
    };

    RazorpayCheckout.open(razorpayOptions)
      .then((data) => {
        setPaymentStatus("Payment Done ✅");
        setTimeout(() => {
          navigation.navigate("Home"); // ✅ go back to Home screen
        }, 1500);
      })
      .catch((error) => {
        Alert.alert("Payment Failed", error.description || error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment</Text>
      <Text style={styles.info}>Bus: {busName}</Text>
      <Text style={styles.info}>Route: {from} ➞ {to}</Text>
      <Text style={styles.info}>Date: {travelDate}</Text>
      <Text style={styles.info}>Seats: {selectedSeats.join(", ")}</Text>
      <Text style={styles.info}>Total Amount: ₹{totalPrice}</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>

      {paymentStatus !== "" && (
        <Text style={styles.successMessage}>{paymentStatus}</Text>
      )}
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#800080",
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#800080",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 30,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  successMessage: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
});
