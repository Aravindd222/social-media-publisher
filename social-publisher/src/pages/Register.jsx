export default function Register() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 bg-white shadow rounded-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 text-center rounded-t-xl">
          <h2 className="text-xl font-semibold">Social Publisher</h2>
          <p>Create your account</p>
        </div>

        <div className="p-6 space-y-4">
          <input className="w-full border p-3 rounded-lg" placeholder="Email" />
          <input className="w-full border p-3 rounded-lg" placeholder="Password" />
          <input className="w-full border p-3 rounded-lg" placeholder="Confirm Password" />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
