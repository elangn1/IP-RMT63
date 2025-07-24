import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuizPlan } from "../features/quizSlice";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";

export default function QuizPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, quizzes, error, plan } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizPlan(id));
  }, [dispatch, id]);

  return (
    <>
      <div className="max-w-xl mx-auto mt-8 flex justify-start">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m5-11v11a1 1 0 001 1h5m-5-11V3m0 0L3 12"
            />
          </svg>
          Home
        </Link>
      </div>
      <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow border border-blue-100 dark:border-blue-900">
        <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
          Quiz Otomatis AI
        </h2>
        {plan && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rencana Belajar:</div>
            <div className="font-semibold text-blue-800 dark:text-blue-200">
              {plan.judulBelajar}
            </div>
          </div>
        )}
        {loading && <div className="py-8 text-center text-amber-50">Loading quiz...</div>}
        {error && <div className="py-8 text-center text-red-500">{error}</div>}
        {quizzes && <SimpleQuizList quizzes={quizzes} />}
      </div>
    </>
  );
}

function SimpleQuizList({ quizzes }) {
  const [show, setShow] = React.useState([]);
  let quizArr = quizzes;
  if (typeof quizzes === "string") {
    try {
      const parsed = JSON.parse(quizzes);
      if (Array.isArray(parsed)) quizArr = parsed;
    } catch {}
  }
  if (!Array.isArray(quizArr)) {
    return (
      <div className="mt-4">
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 prose prose-blue dark:prose-invert max-w-none space-y-4">
          <ReactMarkdown>{quizzes}</ReactMarkdown>
        </div>
      </div>
    );
  }
  React.useEffect(() => {
    setShow(Array(quizArr.length).fill(false));
  }, [quizzes]);
  const handleShow = (idx) => setShow((s) => s.map((v, i) => (i === idx ? !v : v)));
  return (
    <div className="space-y-4 mt-2">
      {quizArr.map((q, i) => (
        <div
          key={i}
          className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-800 shadow"
        >
          <div className="font-bold text-base mb-2 text-blue-700 dark:text-blue-200">
            Soal {i + 1}
          </div>
          <div className="mb-2 text-black dark:text-white text-lg font-semibold">
            <ReactMarkdown>{q.pertanyaan || q.question || q}</ReactMarkdown>
          </div>
          {q.options && Array.isArray(q.options) && q.options.length > 0 && (
            <ul className="list-decimal ml-5 mb-2">
              {q.options.map((opt, idx) => (
                <li key={idx} className="mb-1 text-gray-800 dark:text-gray-100">
                  <span>
                    <ReactMarkdown>{opt}</ReactMarkdown>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {(q.correctAnswer || q.answer) && (
            <div className="mt-2">
              <button
                className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                onClick={() => handleShow(i)}
              >
                {show[i] ? "Sembunyikan Jawaban" : "Tampilkan Jawaban"}
              </button>
              {show[i] && (
                <div className="mt-2 text-sm font-bold text-green-700 dark:text-green-200">
                  <span>Jawaban: </span>
                  <span>
                    <ReactMarkdown>{q.correctAnswer || q.answer}</ReactMarkdown>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
