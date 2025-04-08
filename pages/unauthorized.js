export async function getServerSideProps({ query }) {
    return {
      props: {
        error: query.error || null,
      },
    };
  }
  
  export default function Unauthorized({ error }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-900 p-6">
        <div className="bg-white border border-red-300 p-6 rounded shadow-md text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">401 Unauthorized</h1>
          {error && <p className="mb-4">{decodeURIComponent(error)}</p>}
          <a href="/login" className="text-blue-600 hover:underline">
            🔐 Return to Login
          </a>
        </div>
      </div>
    );
  }
  