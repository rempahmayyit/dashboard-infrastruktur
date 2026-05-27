export default function RestrictedAccess() {
  const hostname = window.location.hostname;

  const isDev =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.");

  // LOCALHOST / DEV MODE
  if (isDev) {
    return (
      <div className="w-full h-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">

          <div className="text-6xl mb-4">
            ✅
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            LOCAL ACCESS ENABLED
          </h1>

          <p className="text-slate-500 mt-4">
            Module is accessible in localhost / development mode.
          </p>

        </div>
      </div>
    );
  }

  // WEB / PRODUCTION MODE
  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-white">
      <div className="text-center max-w-md">

        <div className="text-6xl mb-4">
          🔒
        </div>

        <h1 className="text-3xl font-bold text-slate-800">
          ACCESS RESTRICTED
        </h1>

        <p className="text-slate-500 mt-4">
          You don't currently have access to this module.
        </p>

        <p className="text-slate-400 text-sm mt-2">
          Please contact the system administrator.
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-6 px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition"
        >
          Back
        </button>

      </div>
    </div>
  );
}