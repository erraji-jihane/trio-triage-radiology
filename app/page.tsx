"use client";

import { useState } from "react";

export default function Home() {
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
  const [shakeKey, setShakeKey] = useState(0);

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
    if (!validate()) {
      setShakeKey(k => k + 1);
      return;
    }

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
        <div className="bg-white shadow-[0_1px_2px_rgba(20,38,43,0.06),0_12px_28px_-16px_rgba(20,38,43,0.35)] animate-card-in">
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
                  className="w-full bg-transparent py-2.5 text-sm placeholder:text-[#A9B5B0] focus:outline-none transition-colors"
                />
              </Field>

              <Field label="CIN">
                <input
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="AB123456"
                  className="w-full bg-transparent py-2.5 font-mono tracking-wide text-sm placeholder:text-[#A9B5B0] placeholder:font-sans focus:outline-none transition-colors"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="Symptoms"
                  required
                  error={errors.symptoms}
                  shakeKey={errors.symptoms ? shakeKey : 0}
                >
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Onset, severity, relevant history..."
                    className="w-full bg-transparent py-2.5 text-sm leading-relaxed placeholder:text-[#A9B5B0] focus:outline-none resize-none transition-colors"
                  />
                </Field>
              </div>
            </div>

            <div className="pt-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7C8F8B]">
                Arrival mode <span className="text-[#B4432C]">*</span>
              </p>
              <div
                key={errors.arrivalMode ? shakeKey : 0}
                className={`grid grid-cols-2 gap-2 mt-2 ${
                  errors.arrivalMode ? "animate-shake" : ""
                }`}
              >
                <ModeOption
                  label="Ambulance"
                  active={formData.arrivalMode === "Ambulance"}
                  color="urgent"
                  name="arrivalMode"
                  value="Ambulance"
                  onChange={handleChange}
                />
                <ModeOption
                  label="Walked in"
                  active={formData.arrivalMode === "Hospital"}
                  color="calm"
                  name="arrivalMode"
                  value="Hospital"
                  onChange={handleChange}
                />
              </div>
              {errors.arrivalMode && (
                <p className="text-xs text-[#B4432C] mt-1.5 animate-note-in">
                  {errors.arrivalMode}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "saving"}
              className={`w-full mt-4 py-3 text-sm font-semibold tracking-wide uppercase transition-all duration-200 active:scale-[0.98] ${
                status === "saving"
                  ? "bg-[#4B5D5A] text-white cursor-wait"
                  : "bg-[#14262B] text-white hover:bg-[#1F6F5C] hover:shadow-md"
              }`}
            >
              {status === "saving" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Registering patient...
                </span>
              ) : (
                "Register patient"
              )}
            </button>

            {status === "success" && (
              <StatusNote color="calm" text="Patient registered. Chart has been opened." />
            )}
            {status === "error" && (
              <StatusNote color="urgent" text="Could not save. Check the connection and try again." />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  shakeKey,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  shakeKey?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      key={shakeKey}
      className={`border-b pt-2.5 transition-colors duration-300 ${
        error ? "border-[#B4432C] animate-shake" : "border-[#E1E7E3]"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C8F8B]">
          {label} {required && <span className="text-[#B4432C]">*</span>}
        </label>
        {error && (
          <span className="text-[10px] text-[#B4432C] animate-note-in">
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ModeOption({
  label,
  active,
  color,
  name,
  value,
  onChange
}: {
  label: string;
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
      className={`relative block border px-3.5 py-2.5 cursor-pointer transition-all duration-200 active:scale-[0.97] ${
        active ? activeStyles : "border-[#D7DED9] hover:border-[#A9B5B0] hover:bg-[#FAFBFA]"
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
      <span
        className={`absolute top-2.5 right-2.5 w-2 h-2 border transition-all duration-200 ${
          active
            ? color === "urgent"
              ? "bg-[#B4432C] border-[#B4432C] scale-110"
              : "bg-[#1F6F5C] border-[#1F6F5C] scale-110"
            : "border-[#C7D0CB] scale-100"
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
    <div
      className={`mt-3.5 border-l-2 px-3 py-2 text-sm flex items-center gap-2 animate-note-in ${styles}`}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 animate-check-pop ${
          color === "calm" ? "bg-[#1F6F5C]" : "bg-[#B4432C]"
        }`}
      >
        <span className="text-white text-[10px] leading-none">
          {color === "calm" ? "\u2713" : "!"}
        </span>
      </span>
      {text}
    </div>
  );
}