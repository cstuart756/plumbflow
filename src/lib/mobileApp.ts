/**
 * Mobile App Scaffold - React Native Setup for iOS/Android
 * 
 * Run these commands to generate the mobile app:
 * 
 * Option 1: React Native (Expo)
 * npx create-expo-app plumbflow-mobile
 * cd plumbflow-mobile
 * npx expo install expo-router
 * 
 * Option 2: React Native CLI
 * npx react-native init PlumbflowMobile --template react-native-template-typescript
 * 
 * This file documents the structure and key screens
 */

// app/(auth)/login.tsx
// User login screen

// app/(auth)/register.tsx
// User registration

// app/(app)/bookings.tsx
// List of user bookings

// app/(app)/booking/[id].tsx
// Booking detail and edit screen

// app/(app)/profile.tsx
// User profile and settings

// app/components/BookingForm.tsx
// Form to create new booking

// app/services/api.ts
// API client for communicating with backend

// Example API client for mobile
export const API_URL = "https://plumbflow.com/api";

export const apiClient = {
  async getBookings(userId: string) {
    const res = await fetch(`${API_URL}/customer/bookings?userId=${userId}`);
    return res.json();
  },

  async createBooking(booking: any) {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    return res.json();
  },

  async getNotifications(userId: string) {
    const res = await fetch(`${API_URL}/notifications?userId=${userId}`);
    return res.json();
  },

  async markNotificationAsRead(notificationId: string) {
    const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    return res.json();
  },
};

// Mobile-specific features to implement:
// 1. Push notifications (Firebase Cloud Messaging)
// 2. Biometric authentication (face/fingerprint)
// 3. Offline mode with local storage
// 4. Geolocation for nearby plumbers
// 5. Camera access for photo booking verification
// 6. Calendar integration for booking reminders
// 7. SMS fallback for notifications
// 8. Rating/review system after service completion
