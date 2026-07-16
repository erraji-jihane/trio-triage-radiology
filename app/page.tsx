"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    cin: "",
    symptoms: "",
    arrivalMode: ""
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeKey, setShakeKey] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.symptoms.trim()) nextErrors.symptoms = "Describe the symptoms";
    if (!formData.arrivalMode) nextErrors.arrivalMode = "Select an arrival mode";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!validate()) {
      setShakeKey((current) => current + 1);
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
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
    <main className="relative min-h-0 overflow-hidden bg-[#eaf2f6] text-[#06385e] lg:flex lg:items-center lg:p-8">
      <div aria-hidden="true" className="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#014275]/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -right-32 h-[38rem] w-[38rem] rounded-full bg-[#d13b32]/10 blur-3xl" />

      <section className="intake-viewport relative mx-auto min-h-0 w-full max-w-7xl bg-[#014275] animate-card-in lg:grid lg:overflow-hidden lg:bg-white lg:shadow-[0_28px_80px_rgba(1,66,117,0.22)] lg:rounded-[28px] lg:grid-cols-[0.86fr_1.14fr]">
        <aside className="relative flex h-[38svh] min-h-[18rem] flex-col overflow-hidden bg-[#014275] px-7 pt-10 pb-8 text-white sm:px-10 lg:min-h-0 lg:h-auto lg:px-10 lg:py-11">
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15" />
          <div aria-hidden="true" className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#0c5b93]" />
          <Image
            src="/aba-technology-logo.png"
            alt="ABA Technology"
            width={440}
            height={440}
            priority
            className="absolute right-5 top-5 z-10 h-auto w-14 object-contain sm:right-8 sm:top-7 sm:w-16 lg:left-10 lg:right-auto lg:top-10 lg:w-24"
          />

          <div className="relative lg:pt-24">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a8d7ef]">TRIO clinical intake</p>
            <h1 className="mt-5 max-w-md text-[2.15rem] font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              The right care path starts here.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#d6eaf5] lg:text-base">
            </p>
          </div>

          <div className="relative mt-auto hidden pt-10 lg:block">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a8d7ef]">
              Hover or focus each letter
            </p>
            <div className="flex items-center gap-1.5 text-4xl font-extrabold tracking-tight" aria-label="TRIO means Triage, Routing, Imaging, Orchestration">
              <BrandLetter letter="T" meaning="Triage" />
              <span aria-hidden="true">.</span>
              <BrandLetter letter="R" meaning="Routing" />
              <span aria-hidden="true">.</span>
              <BrandLetter letter="I" meaning="Imaging" />
              <span aria-hidden="true">.</span>
              <BrandLetter letter="O" meaning="Orchestration" />
            </div>
            <p className="mt-3 max-w-sm text-xs leading-5 text-[#c8e0ec]">
              Triage, Routing &amp; Imaging Orchestration
            </p>
          </div>
        </aside>

        <div className="relative z-10 -mt-16 mx-4 flex items-start rounded-[28px] bg-white px-6 py-9 shadow-[0_-8px_30px_rgba(1,38,68,0.12),0_24px_45px_rgba(1,38,68,0.22)] sm:mx-8 sm:px-10 lg:mt-0 lg:mx-0 lg:items-center lg:rounded-none lg:px-14 lg:py-11 lg:shadow-none">
          <div className="w-full max-w-xl">
            <Image src="/trio-logo-cropped.png" alt="TRIO logo" width={560} height={180} priority className="mx-auto h-auto w-48 sm:w-52 lg:mx-0" />
            <div className="mt-6 border-b border-[#d7e4eb] pb-5 text-center lg:mt-7 lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b6398]">Emergency department</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-[#014275]">Patient intake</h2>
              <p className="mt-2 text-sm leading-6 text-[#577083]">
                Fields marked <span className="font-bold text-[#d13b32]">*</span> are required before a bed can be assigned.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="pt-5">
              <div className="grid grid-cols-[1.2fr_.8fr] gap-x-5 sm:gap-x-6">
                <Field label="Full name">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Amina El Idrissi"
                    className="w-full rounded-xl border border-[#d7e4eb] bg-transparent px-3 py-3 text-sm text-[#06385e] placeholder:text-[#9aaebb] outline-none transition-colors focus:border-[#014275] focus:ring-2 focus:ring-[#014275]/10 lg:rounded-none lg:border-0 lg:px-0 lg:focus:ring-0"
                  />
                </Field>

                <Field label="CIN">
                  <input
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="AB123456"
                    className="w-full rounded-xl border border-[#d7e4eb] bg-transparent px-3 py-3 font-mono text-sm tracking-wide text-[#06385e] placeholder:font-sans placeholder:text-[#9aaebb] outline-none transition-colors focus:border-[#014275] focus:ring-2 focus:ring-[#014275]/10 lg:rounded-none lg:border-0 lg:px-0 lg:focus:ring-0"
                  />
                </Field>

                <div className="col-span-2">
                  <Field label="Symptoms" required error={errors.symptoms} shakeKey={errors.symptoms ? shakeKey : 0}>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Onset, severity, relevant history..."
                      className="w-full resize-none rounded-xl border border-[#d7e4eb] bg-transparent px-3 py-3 text-sm leading-relaxed text-[#06385e] placeholder:text-[#9aaebb] outline-none transition-colors focus:border-[#014275] focus:ring-2 focus:ring-[#014275]/10 lg:rounded-none lg:border-0 lg:px-0 lg:focus:ring-0"
                    />
                  </Field>
                </div>
              </div>

              <fieldset className="mt-6">
                <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#557387]">
                  Arrival mode <span className="text-[#d13b32]">*</span>
                </legend>
                <div key={errors.arrivalMode ? shakeKey : 0} className={`mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 ${errors.arrivalMode ? "animate-shake" : ""}`}>
                  <ModeOption label="Ambulance" active={formData.arrivalMode === "Ambulance"} color="urgent" name="arrivalMode" value="Ambulance" onChange={handleChange} />
                  <ModeOption label="Walked in" active={formData.arrivalMode === "Hospital"} color="calm" name="arrivalMode" value="Hospital" onChange={handleChange} />
                </div>
                {errors.arrivalMode && <p className="mt-2 text-xs text-[#c0352e] animate-note-in">{errors.arrivalMode}</p>}
              </fieldset>

              <button
                type="submit"
                disabled={status === "saving"}
                className={`mt-7 flex w-full items-center justify-center py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 active:scale-[0.98] ${status === "saving" ? "cursor-wait bg-[#5b7588]" : "bg-[#014275] hover:bg-[#0b6398] hover:shadow-[0_10px_22px_rgba(1,66,117,0.22)]"}`}
              >
                {status === "saving" ? <span className="inline-flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Registering patient...</span> : "Register patient"}
              </button>

              {status === "success" && <StatusNote color="calm" text="Patient registered. Chart has been opened." />}
              {status === "error" && <StatusNote color="urgent" text="Could not save. Check the connection and try again." />}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandLetter({ letter, meaning }: { letter: string; meaning: string }) {
  return (
    <span tabIndex={0} className="group relative inline-flex cursor-help rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#014275]">
      <span className="rounded-md px-1 transition-all duration-200 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-[#014275] group-focus:-translate-y-1 group-focus:bg-white group-focus:text-[#014275]">{letter}</span>
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold tracking-normal text-[#014275] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
        {meaning}
      </span>
    </span>
  );
}

function Field({ label, required, error, shakeKey, children }: { label: string; required?: boolean; error?: string; shakeKey?: number; children: React.ReactNode }) {
  return (
    <div key={shakeKey} className={`pt-4 transition-colors duration-300 lg:border-b lg:focus-within:border-[#014275] ${error ? "animate-shake lg:border-[#d13b32]" : "lg:border-[#d7e4eb]"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#557387]">{label} {required && <span className="text-[#d13b32]">*</span>}</label>
        {error && <span className="text-[10px] font-medium text-[#c0352e] animate-note-in">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function ModeOption({ label, active, color, name, value, onChange }: { label: string; active: boolean; color: "urgent" | "calm"; name: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const activeStyles = color === "urgent" ? "border-[#d13b32] bg-[#fff0ed] text-[#9f302a]" : "border-[#014275] bg-[#edf7fc] text-[#014275]";

  return (
    <label className={`block cursor-pointer rounded-xl border px-4 py-4 transition-all duration-200 active:scale-[0.98] ${active ? activeStyles : "border-[#d7e4eb] text-[#31566f] hover:border-[#8bb8cf] hover:bg-[#f6fafc]"}`}>
      <input type="radio" name={name} value={value} checked={active} onChange={onChange} className="sr-only" />
      <p className="text-sm font-bold">{label}</p>
    </label>
  );
}

function StatusNote({ color, text }: { color: "urgent" | "calm"; text: string }) {
  const styles = color === "urgent" ? "border-[#d13b32] bg-[#fff0ed] text-[#9f302a]" : "border-[#014275] bg-[#edf7fc] text-[#014275]";
  return <div className={`mt-4 border-l-2 px-3 py-2.5 text-sm animate-note-in ${styles}`}>{text}</div>;
}
