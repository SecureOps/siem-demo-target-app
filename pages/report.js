import { getUserFromRequest } from './api/auth';

export async function getServerSideProps({ req }) {
  const user = getUserFromRequest(req);
  if (!user) return { redirect: { destination: '/login', permanent: false } };

  const report = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    item: `Report Item ${Math.floor(Math.random() * 1000)}`
  }));

  return { props: { report } };
}

export default function Report({ report }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Random Report</h1>
        <table className="w-full table-auto border">
          <thead>
            <tr><th className="border px-4 py-2">ID</th><th className="border px-4 py-2">Item</th></tr>
          </thead>
          <tbody>
            {report.map(row => (
              <tr key={row.id}>
                <td className="border px-4 py-2">{row.id}</td>
                <td className="border px-4 py-2">{row.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <a href="/profile" className="text-blue-500 hover:underline">Back to Profile</a>
        </div>
      </div>
    </div>
  );
}