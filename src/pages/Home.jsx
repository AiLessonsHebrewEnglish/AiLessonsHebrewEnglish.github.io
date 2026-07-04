import { useLanguage } from "../Languages.jsx";
import { Link } from "wouter";

export default function Home() {
  const { t, toggleLanguage, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="font-bold">AI Lessons</h1>

        <button
          onClick={toggleLanguage}
          className="px-3 py-1 border rounded"
        >
          🌐 {lang === "en" ? "עברית" : "English"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto text-center mt-24 px-4">
        <h2 className="text-4xl font-bold mb-4">
          Learn Hebrew & English
        </h2>

        <p className="text-gray-600 mb-10">
          Interactive learning platform
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/member-login" className="px-6 py-3 bg-blue-600 text-white rounded">
            {t("login")}
          </Link>

          <Link href="/member-signup" className="px-6 py-3 bg-green-600 text-white rounded">
<Link href="/member-login" className="px-6 py-3 bg-green-600 text-white rounded">Book Lesson</Link>
            {t("signup")}
          </Link>
        </div>
      </div>
    </div>
  );
}
