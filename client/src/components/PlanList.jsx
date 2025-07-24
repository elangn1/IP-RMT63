import { useEffect, useState } from "react";
import { serverApi } from "../utils/api";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import {
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  setEditingId,
  setEditValue,
  setExpanded
} from "../features/planSlice";

export default function PlanList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil semua state dari Redux
  const { plans, loading, error, creating, editingId, editValue, loadingEditId, expanded } =
    useSelector((state) => state.plan);

  const [judulBelajar, setJudulBelajar] = useState("");

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  async function handleCreatePlan(e) {
    e.preventDefault();
    if (!judulBelajar.trim()) return;
    await dispatch(createPlan(judulBelajar));
    setJudulBelajar("");
    await dispatch(fetchPlans());
    Swal.fire({
      icon: "success",
      text: "Plan berhasil dibuat!",
      timer: 1200,
      showConfirmButton: false
    });
  }

  async function handleUpdatePlan(planId) {
    if (!editValue.trim()) return;
    // Set editingId agar loadingEditId bisa diatur oleh slice
    dispatch(setEditingId(planId));
    const result = await dispatch(updatePlan({ id: planId, judulBelajar: editValue }));
    dispatch(setEditingId(null));
    dispatch(setEditValue(""));
    dispatch(fetchPlans());
    if (updatePlan.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        text: "Plan berhasil diupdate!",
        timer: 1200,
        showConfirmButton: false
      });
    } else if (updatePlan.rejected.match(result)) {
      Swal.fire({
        icon: "error",
        text: result.payload || "Gagal update plan",
        timer: 1200,
        showConfirmButton: false
      });
    }
  }

  async function handleDeletePlan(planId) {
    const result = await Swal.fire({
      title: "Yakin hapus plan ini?",
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      await dispatch(deletePlan(planId));
      dispatch(fetchPlans());
      Swal.fire({
        icon: "success",
        text: "Plan berhasil dihapus!",
        timer: 1200,
        showConfirmButton: false
      });
    }
  }

  if (loading) return <div className="text-center py-8 text-white">Loading plans...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
        Rencana Belajar Kamu
      </h2>
      <form onSubmit={handleCreatePlan} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Judul rencana belajar..."
          value={judulBelajar}
          onChange={(e) => setJudulBelajar(e.target.value)}
          className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 bg-blue-50 dark:bg-gray-800 dark:text-white dark:border-blue-700"
          disabled={creating}
        />
        <button
          type="submit"
          disabled={creating || !judulBelajar.trim()}
          className="px-6 py-2 bg-blue-700 text-white font-bold rounded-lg shadow hover:bg-blue-800 transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
        >
          {creating ? "Membuat..." : "Tambah"}
        </button>
        {error && <div className="w-full text-red-500 text-sm mt-2">{error}</div>}
      </form>
      {plans.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-300">
          Belum ada rencana. Yuk buat rencana belajar!
        </div>
      ) : (
        <ul className="space-y-6">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="p-6 bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 transition hover:shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                {editingId === plan.id ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => dispatch(setEditValue(e.target.value))}
                      className="flex-1 px-2 py-1 border border-blue-300 rounded mr-2 text-gray-800 dark:text-white dark:bg-gray-800"
                      autoFocus
                    />
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 mr-1 flex items-center gap-1 disabled:opacity-60"
                      disabled={loadingEditId === plan.id}
                      onClick={() => handleUpdatePlan(plan.id)}
                    >
                      {loadingEditId === plan.id ? (
                        <svg className="animate-spin h-4 w-4 mr-1 inline-block" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : null}
                      Simpan
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-300 text-gray-800 rounded text-xs font-bold hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      onClick={() => {
                        dispatch(setEditingId(null));
                        dispatch(setEditValue(""));
                      }}
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300 capitalize">
                      {plan.judulBelajar || plan.title}
                    </span>
                    {plan.createdAt && (
                      <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800 font-bold"
                      onClick={() => {
                        dispatch(setEditingId(plan.id));
                        dispatch(setEditValue(plan.judulBelajar));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 font-bold"
                      onClick={() => navigate(`/quiz/${plan.id}`)}
                    >
                      Quiz
                    </button>
                    <button
                      className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 font-bold"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
              {plan.aiFeedback && (
                <div className="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-sm space-y-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-300 block mb-2">
                    AI Feedback:
                  </span>
                  {expanded[plan.id] ? (
                    <div className="prose prose-blue dark:prose-invert max-w-none mt-2 space-y-4">
                      <ReactMarkdown>{plan.aiFeedback}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="prose prose-blue dark:prose-invert max-w-none mt-2 space-y-4">
                      <ReactMarkdown>
                        {plan.aiFeedback.split("\n").slice(0, 3).join("\n") +
                          (plan.aiFeedback.split("\n").length > 3 ? "\n..." : "")}
                      </ReactMarkdown>
                    </div>
                  )}
                  {plan.aiFeedback.split("\n").length > 3 && (
                    <button
                      className="block mt-2 text-xs text-blue-500 underline hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                      onClick={() =>
                        dispatch(setExpanded({ ...expanded, [plan.id]: !expanded[plan.id] }))
                      }
                    >
                      {expanded[plan.id] ? "Sembunyikan" : "Lihat Selengkapnya"}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
