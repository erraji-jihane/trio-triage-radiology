"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [ticketNo, setTicketNo] = useState<string | null>(null);

  useEffect(() => {
    setTicketNo(String(Math.floor(100 + Math.random() * 900)));
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    cin: "",
    symptoms: "",
    arrivalMode: ""
  });

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: { [key: string]: string } = {};
    if (!formData.symptoms.trim()) next.symptoms = "Describe the symptoms";
    if (!formData.arrivalMode) next.arrivalMode = "Select one";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("saving");
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ fullName: "", cin: "", symptoms: "", arrivalMode: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2EF] flex items-center justify-center p-3 sm:p-6 text-[#14262B]">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-[0_1px_2px_rgba(20,38,43,0.06),0_12px_28px_-16px_rgba(20,38,43,0.35)]">
          {/* TICKET STUB */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-dashed border-[#C7D0CB]">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#7C8F8B]">
                Admission No.
              </p>
              <p className="font-mono text-lg font-bold text-[#14262B] tabular-nums leading-tight">
                {ticketNo ? `#${ticketNo}` : "#---"}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-[#1F6F5C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F6F5C] animate-pulse" />
                Intake Open
              </span>
              <p className="text-[9px] font-mono text-[#7C8F8B] mt-0.5 hidden sm:block">
                Emergency Registration
              </p>
            </div>
          </div>

          {/* HEADER */}
          <div className="px-5 sm:px-8 pt-5 pb-1">
            <h1
              className="text-2xl sm:text-[26px] leading-none font-bold tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Patient Intake
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5D5A] mt-1.5">
              Fields marked <span className="text-[#B4432C]">*</span> are required
              before a bed can be assigned.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-6 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 border-t border-[#E1E7E3]">
              <Field label="Full name">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Amina El Idrissi"
                  className="w-full bg-transparent py-2.5 text-sm placeholder:text-[#A9B5B0] focus:outline-none"
                />
              </Field>

              <Field label="CIN">
                <input
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="AB123456"
                  className="w-full bg-transparent py-2.5 font-mono tracking-wide text-sm placeholder:text-[#A9B5B0] placeholder:font-sans focus:outline-none"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Symptoms" required error={errors.symptoms}>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Onset, severity, relevant history..."
                    required
                    className="w-full bg-transparent py-2.5 text-sm leading-relaxed placeholder:text-[#A9B5B0] focus:outline-none resize-none"
                  />
                </Field>
              </div>
            </div>

            <div className="pt-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7C8F8B]">
                Arrival mode <span className="text-[#B4432C]">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <ModeOption
                  label="Ambulance"
                  sub="Priority triage"
                  active={formData.arrivalMode === "Ambulance"}
                  color="urgent"
                  name="arrivalMode"
                  value="Ambulance"
                  onChange={handleChange}
                />
                <ModeOption
                  label="Walked in"
                  sub="Standard queue"
                  active={formData.arrivalMode === "Hospital"}
                  color="calm"
                  name="arrivalMode"
                  value="Hospital"
                  onChange={handleChange}
                />
              </div>
              {errors.arrivalMode && (
                <p className="text-xs text-[#B4432C] mt-1.5">{errors.arrivalMode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "saving"}
              className={`w-full mt-4 py-3 text-sm font-semibold tracking-wide uppercase transition-colors ${
                status === "saving"
                  ? "bg-[#4B5D5A] text-white cursor-wait"
                  : "bg-[#14262B] text-white hover:bg-[#1F6F5C]"
              }`}
            >
              {status === "saving" ? "Registering patient..." : "Register patient"}
            </button>

            {status === "success" && (
              <StatusNote color="calm" text="Patient registered. Chart has been opened." />
            )}
            {status === "error" && (
              <StatusNote color="urgent" text="Could not save. Check the connection and try again." />
            )}
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-[#8C9A96] mt-3 tracking-wide">
          All entries are logged with the admission number above
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border-b pt-2.5 transition-colors ${
        error ? "border-[#B4432C]" : "border-[#E1E7E3]"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C8F8B]">
          {label} {required && <span className="text-[#B4432C]">*</span>}
        </label>
        {error && <span className="text-[10px] text-[#B4432C]">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function ModeOption({
  label,
  sub,
  active,
  color,
  name,
  value,
  onChange
}: {
  label: string;
  sub: string;
  active: boolean;
  color: "urgent" | "calm";
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const activeStyles =
    color === "urgent"
      ? "border-[#B4432C] bg-[#FBEEE9]"
      : "border-[#1F6F5C] bg-[#EAF3F0]";

  return (
    <label
      className={`relative block border px-3.5 py-2.5 cursor-pointer transition-colors ${
        active ? activeStyles : "border-[#D7DED9] hover:border-[#A9B5B0]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={onChange}
        className="sr-only"
      />
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-[10px] text-[#7C8F8B] mt-0.5">{sub}</p>
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 border ${
          active
            ? color === "urgent"
              ? "bg-[#B4432C] border-[#B4432C]"
              : "bg-[#1F6F5C] border-[#1F6F5C]"
            : "border-[#C7D0CB]"
        }`}
      />
    </label>
  );
}

function StatusNote({ color, text }: { color: "urgent" | "calm"; text: string }) {
  const styles =
    color === "urgent"
      ? "border-[#B4432C] text-[#8A3220] bg-[#FBEEE9]"
      : "border-[#1F6F5C] text-[#14503F] bg-[#EAF3F0]";
  return (
    <div className={`mt-3.5 border-l-2 px-3 py-2 text-sm ${styles}`}>{text}</div>
  );
}