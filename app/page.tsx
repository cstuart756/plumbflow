import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        PlumbFlow Booking
      </h1>

      <BookingForm />
    </main>
  );
}
