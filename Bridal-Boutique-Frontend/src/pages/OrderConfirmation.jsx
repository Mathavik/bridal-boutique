import { Link } from "react-router-dom";

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12 flex items-center justify-center">
      <div className="max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">Order Confirmed</h1>
        <p className="mt-3 text-gray-600">Your order has been placed successfully. We will send an update shortly.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-[#181818] px-4 py-3 text-white">Continue Shopping</Link>
      </div>
    </div>
  );
}
