import { getUserFromRequest } from './api/auth.js';

export async function getServerSideProps({ req, query }) {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }

  return {
    props: {
      user,
      success: query.success || null,
      error: query.error || null,
    },
  };
}

export default function Profile({ user, success, error }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {user.username}</h1>

        {success && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
            Password changed successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
            {decodeURIComponent(error)}
          </div>
        )}

        <form method="POST" action="/api/changepass" className="mb-6">
          <div className="mb-2">
            <input
              name="oldpass"
              type="password"
              placeholder="Old Password"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              name="newpass"
              type="password"
              placeholder="New Password"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <a
            href="/report"
            className="w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            📊 View Report
          </a>
          <a
            href="/api/logout"
            className="w-full text-center bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            🔓 Logout
          </a>
        </div>
      </div>
    </div>
  );
}
