"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import {
  getCampaigns,
  createCampaign,
  sendCampaign,
  generateEmailContent,
} from "@/services/emailCampaign";
import { getDepartments } from "@/services/department";

const purposes = [
  { value: "EXAM", label: "Exam Schedule" },
  { value: "FEE", label: "Fee Reminder" },
  { value: "EVENT", label: "Event Notice" },
  { value: "PLACEMENT", label: "Placement Drive" },
  { value: "GENERAL", label: "General Announcement" },
];

type Campaign = {
  id: number;
  purpose: string;
  subject: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
};

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);

  const [purpose, setPurpose] = useState("GENERAL");
  const [details, setDetails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [deptOptions, setDeptOptions] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false));

    getDepartments()
      .then((deps: any[]) =>
        setDeptOptions(
          deps.map((d: any) => ({ code: d.code || d.name, name: d.name }))
        )
      )
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg("");
    try {
      const data = await generateEmailContent(purpose, details);
      setSubject(data.subject);
      setBody(data.body);
    } catch {
      setErrorMsg("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!subject || !body) {
      setErrorMsg("Subject and body are required");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const filter: Record<string, any> = {};
      if (departments.length) filter.departments = departments;
      if (years.length) filter.years = years;

      const result = await createCampaign({
        purpose,
        subject,
        body,
        recipient_filter: filter,
      });

      const campaignId = result.campaign?.id;
      if (!campaignId) {
        setErrorMsg("Campaign created but no ID returned");
        return;
      }

      setSendingId(campaignId);
      const sendResult = await sendCampaign(campaignId);
      setSuccessMsg(sendResult.message || `Sent to ${result.total_recipients} students`);
      setSendingId(null);

      const updated = await getCampaigns();
      setCampaigns(updated);

      setSubject("");
      setBody("");
      setDetails("");
      setDepartments([]);
      setYears([]);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Failed to send");
      setSendingId(null);
    }
  };

  const toggleDept = (code: string) => {
    setDepartments((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
    );
  };

  const toggleYear = (y: number) => {
    setYears((prev) =>
      prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 space-y-8 p-8">
          <h2 className="text-3xl font-bold text-slate-800">Email Campaigns</h2>

          {successMsg && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">{successMsg}</div>
          )}
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{errorMsg}</div>
          )}

          {/* Create Campaign */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-slate-700">New Campaign</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-lg border p-2.5"
                >
                  {purposes.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Details (for AI)</label>
                <input
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Final exams starting Dec 10"
                  className="w-full rounded-lg border p-2.5"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? "Generating..." : "✨ Generate with AI"}
            </button>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border p-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border p-2.5 font-mono text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Filter by Department</label>
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                  {deptOptions.map((d) => (
                    <button
                      key={d.code}
                      onClick={() => toggleDept(d.code)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        departments.includes(d.code)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Filter by Year</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((y) => (
                    <button
                      key={y}
                      onClick={() => toggleYear(y)}
                      className={`rounded-full px-4 py-1 text-xs font-medium ${
                        years.includes(y)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      Year {y}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-400">Leave all unselected for all students</p>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={sendingId !== null}
              className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {sendingId !== null ? "Sending..." : "Send Email"}
            </button>
          </div>

          {/* Campaign History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Campaign History</h3>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : campaigns.length === 0 ? (
              <p className="text-slate-400">No campaigns yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Subject</th>
                      <th className="pb-3 pr-4 font-medium">Purpose</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">Sent</th>
                      <th className="pb-3 pr-4 font-medium">Failed</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium text-slate-800">{c.subject}</td>
                        <td className="py-3 pr-4 text-slate-600">
                          {purposes.find((p) => p.value === c.purpose)?.label || c.purpose}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              c.status === "SENT"
                                ? "bg-green-100 text-green-700"
                                : c.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{c.sent_count}/{c.total_recipients}</td>
                        <td className="py-3 pr-4 text-slate-600">{c.failed_count}</td>
                        <td className="py-3 text-slate-500">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
