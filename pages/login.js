export default function Login() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <form method="POST" action="/api/login" className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input name="username" placeholder="Username" className="mb-2 w-full px-3 py-2 border rounded" required />
          <input name="password" type="password" placeholder="Password" className="mb-4 w-full px-3 py-2 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    );
  }