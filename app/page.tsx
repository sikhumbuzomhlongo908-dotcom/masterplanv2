"use client";

import { useState, useRef } from "react";

const TABS = [
  { id: "workout", label: "Workout", icon: "workout" },
  { id: "sleep", label: "Sleep", icon: "sleep" },
  { id: "skin", label: "Skincare", icon: "skin" },
  { id: "hair", label: "Hair", icon: "hair" },
  { id: "fragrance", label: "Fragrance", icon: "fragrance" },
  { id: "hygiene", label: "Hygiene", icon: "hygiene" },
];

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive", "Acne-prone"];
const SKIN_CONCERNS = ["Acne", "Dark spots", "Dullness", "Wrinkles", "Uneven tone", "Large pores", "Redness", "Hyperpigmentation"];
const HAIR_TYPES = ["Straight (1A-1C)", "Wavy (2A-2C)", "Curly (3A-3C)", "Coily/Kinky (4A-4C)"];
const HAIR_CONCERNS = ["Thinning", "Frizz", "Dryness", "Oiliness", "Split ends", "Dandruff", "Breakage", "No growth"];
const BUDGETS = ["$0 (free only)", "Under $20", "$20-$50", "$50-$100", "$100+"];
const GOALS = ["Lose fat", "Build muscle", "Get toned", "More energy", "Better endurance", "Stay healthy"];
const ACTIVITY = ["Sedentary", "Light (1-2x/wk)", "Moderate (3-4x/wk)", "Very active (5-6x/wk)"];
const EQUIPMENT = ["No equipment", "Resistance bands", "Dumbbells at home", "Full gym access"];
const SCENTS = ["Fresh & clean", "Floral", "Woody & warm", "Fruity & sweet", "Musky & sensual", "Citrus & energizing"];

const DEF_PROFILE = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  activity: "",
  equipment: "",
  fitnessGoals: [] as string[],
  skinType: "",
  skinConcerns: [] as string[],
  skinTone: "",
  hairType: "",
  hairConcerns: [] as string[],
  budget: "",
  scentPrefs: [] as string[],
  sleepTime: "",
  wakeTime: "",
  sleepIssues: "",
  extraNotes: "",
};

function md(text: string) {
  if (!text) return "";
  return text
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^[-•] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, (m) => (m.trim() ? `<p>${m}</p>` : ""))
    .replace(/<p><\/p>/g, "")
    .replace(/<p>(<[hul])/g, "$1")
    .replace(/(<\/[hul][^>]*>)<\/p>/g, "$1");
}

function TabIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    workout: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 17h16M6 12h12M3 7v0a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1v0M17 7v0a1 1 0 011-1h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a1 1 0 01-1-1v0" />
      </svg>
    ),
    sleep: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
    skin: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    hair: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121A3 3 0 109.88 9.88m4.242 4.242L9.88 9.88m4.242 4.242L21 21M9.88 9.88L3 3" />
      </svg>
    ),
    fragrance: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
      </svg>
    ),
    hygiene: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function MasterPlan() {
  const [phase, setPhase] = useState<"profile" | "main">("profile");
  const [profile, setProfile] = useState(DEF_PROFILE);
  const [activeTab, setActiveTab] = useState("workout");
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoB64, setPhotoB64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof DEF_PROFILE, v: string) => setProfile((p) => ({ ...p, [k]: v }));
  const toggle = (k: "fitnessGoals" | "skinConcerns" | "hairConcerns" | "scentPrefs", v: string) =>
    setProfile((p) => ({
      ...p,
      [k]: p[k].includes(v) ? p[k].filter((x: string) => x !== v) : [...p[k], v],
    }));

  const canStart = profile.name && profile.age && profile.gender && profile.budget;

  const generate = async (section: string) => {
    setLoading((l) => ({ ...l, [section]: true }));
    setErrors((e) => ({ ...e, [section]: null }));
    setResults((r) => ({ ...r, [section]: "" }));

    const p = profile;
    const budgetNote = `Budget: ${p.budget}. Suggest products/services at this price range and specify where to buy them (drugstore, Amazon, Sephora, etc.).`;

    const prompts: Record<string, string> = {
      workout: `You are an expert personal trainer. Create a personalized workout plan for ${p.name}.
Stats: Age ${p.age}, ${p.gender}, Height ${p.height}, Weight ${p.weight}.
Activity level: ${p.activity}. Equipment: ${p.equipment}. Goals: ${p.fitnessGoals.join(", ")}.
${budgetNote}
${p.extraNotes ? "Notes: " + p.extraNotes : ""}

Provide:
## Workout Overview
Brief assessment of starting point.

## Weekly Schedule
Specific days, exercises with sets/reps/duration. Make it bodyweight-friendly if no equipment.

## Timeline & Results
- Week 1-4: What to expect
- Month 2-3: First visible changes
- Month 6: Major milestone
- Month 12: Goal achievement

## Nutrition Tips
Key eating habits for their goals. Budget-friendly food suggestions.

## Motivation Tips
3 tips to stay consistent.`,

      sleep: `You are a sleep specialist. Help ${p.name} (${p.age}, ${p.gender}) fix their sleep schedule.
Current sleep: ${p.sleepTime || "unknown"}. Desired wake time: ${p.wakeTime || "unknown"}.
Issues: ${p.sleepIssues || "general poor sleep"}.
${budgetNote}

Provide:
## Sleep Assessment
What their current schedule suggests about their health.

## 2-Week Reset Plan
Day-by-day guide to gradually shift their schedule to ideal times.

## Bedtime Routine
Step-by-step 30-60 min wind-down ritual.

## Morning Routine
How to wake up energized and actually get up.

## Sleep Tools & Aids
Budget-friendly products (apps, supplements, gadgets) with where to buy and cost.

## Habits to Drop
What is likely ruining their sleep.`,

      skin: `You are a licensed esthetician and skincare expert. Create a routine for ${p.name}.
Age: ${p.age}, Gender: ${p.gender}, Skin type: ${p.skinType}, Tone: ${p.skinTone}.
Concerns: ${p.skinConcerns.join(", ")}.
${budgetNote}

Provide:
## Skin Profile
Analysis of their skin type and what it needs.

## Morning Routine
Step-by-step with specific product recommendations (name, brand, price, where to buy).

## Evening Routine
Step-by-step with specific product recommendations.

## Weekly Treatments
Masks, exfoliation, etc. with product names and prices.

## Ingredients to Look For
Key actives for their concerns.

## Ingredients to Avoid
What will make their skin worse.

## Timeline
When they'll see results.`,

      hair: `You are a professional hairstylist and trichologist. Create a hair plan for ${p.name}.
Age: ${p.age}, Gender: ${p.gender}, Hair type: ${p.hairType}.
Concerns: ${p.hairConcerns.join(", ")}.
${budgetNote}

Provide:
## Hair Profile
Assessment of their hair type and what it needs.

## Hairstyle Recommendations
5 specific hairstyles that would look great for their hair type and gender. Describe each one vividly and explain why it suits them. Include how to ask for it at the salon.

## Hair Care Routine
Daily, weekly, and monthly routines with specific product names, prices, and where to buy.

## Growth & Repair Tips
How to grow healthier, longer hair faster.

## Styling Tips
How to style their hair type without damage.

## Salon Schedule
How often to cut/treat and what services to get.`,

      fragrance: `You are a fragrance expert and perfumer. Recommend scents for ${p.name}.
Age: ${p.age}, Gender: ${p.gender}. Scent preferences: ${p.scentPrefs.join(", ")}.
${budgetNote}

Provide:
## Scent Profile
What their preferences say about their personality and ideal fragrance family.

## Top 5 Perfume Recommendations
For each: Name, brand, scent description (top/middle/base notes), occasion, price range, exactly where to buy (Sephora, Ulta, Amazon, TJ Maxx, etc.), and a cheaper dupe if applicable.

## Budget-Friendly Dupes
3 affordable alternatives under $30 that smell similar to luxury scents.

## How to Apply Fragrance
Pulse points, layering, making it last longer.

## Building a Fragrance Wardrobe
How to have a scent for every occasion/mood.

## Hygiene Foundation
Why soap, deodorant, and body care come first — product recommendations at their budget.`,

      hygiene: `You are a grooming and wellness expert. Create a complete hygiene routine for ${p.name}.
Age: ${p.age}, Gender: ${p.gender}.
${budgetNote}

Provide:
## Daily Hygiene Checklist
Morning and evening — everything they need to do and in what order.

## Shower Routine
How to properly shower (yes, there's a right way), water temp, products with brand names and prices.

## Oral Care
Full routine — brushing, flossing, tongue scraping, whitening. Product recommendations.

## Body Care
Deodorant (clinical? natural?), body lotion, exfoliation. Product recommendations with prices.

## Hands, Feet & Nails
How to maintain clean, healthy nails and soft hands/feet.

## Face Washing (Basic)
Simple face wash routine separate from full skincare.

## Clothing & Laundry
How often to wash clothes, bedding, etc. How to smell fresh all day.

## Product Shopping List
Complete list with prices and where to buy everything.`,
    };

    try {
      let prompt = prompts[section];
      let imageBase64: string | undefined;

      if (section === "hair" && photoB64) {
        prompt += "\n\nI've attached a photo of the person. Please also analyze their current hair from the photo and tailor the hairstyle recommendations accordingly, commenting on what you see.";
        imageBase64 = photoB64;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageBase64 }),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        console.log("[v0] API returned error:", data.error);
        throw new Error(data.error || "Failed to generate");
      }

      setResults((r) => ({ ...r, [section]: data.text }));
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Something went wrong";
      console.log("[v0] Caught error:", errorMsg);
      setErrors((er) => ({ ...er, [section]: errorMsg }));
    } finally {
      setLoading((l) => ({ ...l, [section]: false }));
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = (ev.target?.result as string).split(",")[1];
      setPhotoB64(b64);
    };
    reader.readAsDataURL(file);
  };

  // Profile Phase
  if (phase === "profile") {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f0e8] relative overflow-x-hidden">
        {/* Noise texture */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
        }} />
        
        {/* Glow orbs */}
        <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -top-[150px] -right-[150px]" style={{
          background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)"
        }} />
        <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -bottom-[200px] -left-[200px]" style={{
          background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-[800px] mx-auto px-5 pb-20">
          {/* Hero */}
          <div className="text-center py-16 pb-12 border-b border-[#1e1e1e] mb-10">
            <span className="text-[10px] tracking-[5px] uppercase text-[#c9a96e] mb-6 block animate-fadeUp">
              Your personal glow-up system
            </span>
            <h1 className="font-serif text-[clamp(56px,13vw,104px)] font-light tracking-[8px] leading-[0.92] text-[#f5f0e8] mb-5 animate-fadeUp animation-delay-100">
              MASTER<br /><em className="text-[#c9a96e] italic">PLAN</em>
            </h1>
            <p className="text-[13px] text-[#6b6b6b] tracking-[1px] font-light animate-fadeUp animation-delay-200">
              Skin. Hair. Body. Sleep. Scent. Hygiene. All in one.
            </p>
          </div>

          {/* Basics Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              The Basics
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Your Name</label>
                <input
                  placeholder="What should we call you?"
                  value={profile.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={profile.age}
                  onChange={(e) => set("age", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                >
                  <option value="">Select...</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Monthly Budget for Glow-Up</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      className={`bg-transparent border px-4 py-2 rounded-full text-xs cursor-pointer transition-all ${
                        profile.budget === b
                          ? "border-[#c9a96e] text-[#c9a96e] bg-[rgba(201,169,110,0.15)]"
                          : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#c9a96e]"
                      }`}
                      onClick={() => set("budget", b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body & Fitness Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Body & Fitness
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Height (ft/in or cm)</label>
                <input
                  placeholder={'e.g. 5\'6" or 168cm'}
                  value={profile.height}
                  onChange={(e) => set("height", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Weight (lbs or kg)</label>
                <input
                  placeholder="e.g. 145 lbs"
                  value={profile.weight}
                  onChange={(e) => set("weight", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-3.5">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Activity Level</label>
              <select
                value={profile.activity}
                onChange={(e) => set("activity", e.target.value)}
                className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
              >
                <option value="">Select...</option>
                {ACTIVITY.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 mb-3.5">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Equipment Access</label>
              <select
                value={profile.equipment}
                onChange={(e) => set("equipment", e.target.value)}
                className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
              >
                <option value="">Select...</option>
                {EQUIPMENT.map((eq) => (
                  <option key={eq}>{eq}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Fitness Goals (pick all that apply)</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    className={`bg-transparent border px-4 py-2 rounded-[2px] text-xs cursor-pointer transition-all ${
                      profile.fitnessGoals.includes(g)
                        ? "border-[#c9a96e] text-[#c9a96e] bg-[rgba(201,169,110,0.15)]"
                        : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    onClick={() => toggle("fitnessGoals", g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skin Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Skin
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Skin Type</label>
                <select
                  value={profile.skinType}
                  onChange={(e) => set("skinType", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                >
                  <option value="">Select...</option>
                  {SKIN_TYPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Skin Tone</label>
                <select
                  value={profile.skinTone}
                  onChange={(e) => set("skinTone", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                >
                  <option value="">Select...</option>
                  {["Fair", "Light", "Medium", "Tan", "Deep", "Rich"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Skin Concerns (pick all that apply)</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {SKIN_CONCERNS.map((c) => (
                  <button
                    key={c}
                    className={`bg-transparent border px-4 py-2 rounded-[2px] text-xs cursor-pointer transition-all ${
                      profile.skinConcerns.includes(c)
                        ? "border-[#c9a96e] text-[#c9a96e] bg-[rgba(201,169,110,0.15)]"
                        : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    onClick={() => toggle("skinConcerns", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hair Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Hair
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="flex flex-col gap-2 mb-3.5">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Hair Type</label>
              <select
                value={profile.hairType}
                onChange={(e) => set("hairType", e.target.value)}
                className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
              >
                <option value="">Select...</option>
                {HAIR_TYPES.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Hair Concerns (pick all that apply)</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {HAIR_CONCERNS.map((c) => (
                  <button
                    key={c}
                    className={`bg-transparent border px-4 py-2 rounded-[2px] text-xs cursor-pointer transition-all ${
                      profile.hairConcerns.includes(c)
                        ? "border-[#c9a96e] text-[#c9a96e] bg-[rgba(201,169,110,0.15)]"
                        : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    onClick={() => toggle("hairConcerns", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sleep Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Sleep
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Current Bedtime</label>
                <input
                  type="time"
                  value={profile.sleepTime}
                  onChange={(e) => set("sleepTime", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3.5">
                <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Desired Wake Time</label>
                <input
                  type="time"
                  value={profile.wakeTime}
                  onChange={(e) => set("wakeTime", e.target.value)}
                  className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Sleep Issues (optional)</label>
              <input
                placeholder="e.g. can't fall asleep, wake up at 3am, oversleeping..."
                value={profile.sleepIssues}
                onChange={(e) => set("sleepIssues", e.target.value)}
                className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e]"
              />
            </div>
          </div>

          {/* Fragrance Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Fragrance Preferences
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Scent Vibes (pick all that apply)</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {SCENTS.map((s) => (
                  <button
                    key={s}
                    className={`bg-transparent border px-4 py-2 rounded-[2px] text-xs cursor-pointer transition-all ${
                      profile.scentPrefs.includes(s)
                        ? "border-[#c9a96e] text-[#c9a96e] bg-[rgba(201,169,110,0.15)]"
                        : "border-[#2a2a2a] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    onClick={() => toggle("scentPrefs", s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extra Notes Card */}
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mb-2.5">
            <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
              Anything Else?
              <span className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2.5px] uppercase text-[#6b6b6b]">Extra notes, goals, events, or context (optional)</label>
              <textarea
                placeholder="e.g. I have a wedding in 3 months, I'm postpartum, I'm on a budget, I work night shifts..."
                value={profile.extraNotes}
                onChange={(e) => set("extraNotes", e.target.value)}
                className="bg-[#080808] border border-[#2a2a2a] text-[#f5f0e8] px-3.5 py-3 text-sm font-light rounded-[2px] outline-none transition-colors focus:border-[#c9a96e] resize-y min-h-[80px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full py-5 mt-2 bg-gradient-to-br from-[#c9a96e] to-[#a07840] text-[#080808] border-none font-serif text-[22px] tracking-[5px] font-semibold cursor-pointer rounded-[2px] transition-all hover:translate-y-[-1px] hover:shadow-[0_12px_32px_rgba(201,169,110,0.2)] disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0"
            disabled={!canStart}
            onClick={() => setPhase("main")}
          >
            BUILD MY MASTER PLAN
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeUp {
            animation: fadeUp 0.6s forwards;
          }
          .animation-delay-100 {
            animation-delay: 0.1s;
            opacity: 0;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  // Main Phase
  const p = profile;

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f0e8] relative overflow-x-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
      }} />
      
      {/* Glow orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -top-[150px] -right-[150px]" style={{
        background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)"
      }} />
      <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 -bottom-[200px] -left-[200px]" style={{
        background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)"
      }} />

      <div className="relative z-10 max-w-[800px] mx-auto px-5 pb-20">
        {/* Hero */}
        <div className="text-center py-16 pb-8">
          <span className="text-[10px] tracking-[5px] uppercase text-[#c9a96e] mb-6 block">
            Your Personal System
          </span>
          <h1 className="font-serif text-[clamp(40px,9vw,72px)] font-light tracking-[8px] leading-[0.92] text-[#f5f0e8] mb-2">
            MASTER<br /><em className="text-[#c9a96e] italic">PLAN</em>
          </h1>
          <p className="text-[13px] text-[#6b6b6b] tracking-[1px] font-light mt-2">
            Welcome, {p.name}. Your plan is ready to generate.
          </p>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-[rgba(8,8,8,0.92)] backdrop-blur-[12px] border-b border-[#1e1e1e] mx-[-20px] px-5">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`bg-transparent border-none py-4 px-4 text-[11px] tracking-[2px] uppercase cursor-pointer transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                  activeTab === t.id
                    ? "text-[#c9a96e] border-b-[#c9a96e]"
                    : "text-[#6b6b6b] border-b-transparent hover:text-[#f5f0e8]"
                }`}
                onClick={() => setActiveTab(t.id)}
              >
                <TabIcon type={t.icon} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="py-9">
          {/* Profile Banner */}
          <div className="bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.3)] rounded-[2px] py-3.5 px-5 flex items-center justify-between mb-6 flex-wrap gap-3">
            <span className="text-xs tracking-[1px] text-[#c9a96e]">
              Profile: {p.name} / {p.age} / {p.gender} / Budget {p.budget}
            </span>
            <button
              className="bg-transparent border border-[rgba(201,169,110,0.4)] text-[#c9a96e] py-1.5 px-3.5 rounded-[2px] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all hover:bg-[rgba(201,169,110,0.15)]"
              onClick={() => setPhase("profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "workout" && (
            <TabContent
              title="Fitness Plan"
              description="AI will create a full workout schedule, timeline for visible results, and nutrition tips based on your stats and goals."
              meta={
                <>
                  Equipment: <span className="text-[#e8d5a3]">{p.equipment || "Not specified"}</span> &middot; Goals:{" "}
                  <span className="text-[#e8d5a3]">{p.fitnessGoals.join(", ") || "Not specified"}</span>
                </>
              }
              loading={loading.workout}
              error={errors.workout}
              result={results.workout}
              onGenerate={() => generate("workout")}
              loadingText="Building your plan..."
            />
          )}

          {activeTab === "sleep" && (
            <TabContent
              title="Sleep Reset"
              description="Get a 2-week schedule reset plan, a bedtime ritual, morning routine, and product recommendations to finally fix your sleep."
              meta={
                <>
                  Current: <span className="text-[#e8d5a3]">{p.sleepTime || "?"}</span> &middot; Wake:{" "}
                  <span className="text-[#e8d5a3]">{p.wakeTime || "?"}</span>
                </>
              }
              loading={loading.sleep}
              error={errors.sleep}
              result={results.sleep}
              onGenerate={() => generate("sleep")}
              loadingText="Crafting your sleep reset..."
            />
          )}

          {activeTab === "skin" && (
            <TabContent
              title="Skincare Routine"
              description="A full AM + PM routine with specific product names, prices, and where to buy tailored to your skin type and budget."
              meta={
                <>
                  Skin: <span className="text-[#e8d5a3]">{p.skinType || "?"}</span> &middot; Concerns:{" "}
                  <span className="text-[#e8d5a3]">{p.skinConcerns.join(", ") || "None selected"}</span>
                </>
              }
              loading={loading.skin}
              error={errors.skin}
              result={results.skin}
              onGenerate={() => generate("skin")}
              loadingText="Building your routine..."
            />
          )}

          {activeTab === "hair" && (
            <div>
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8">
                <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
                  Hair & Style
                  <span className="flex-1 h-px bg-[#1e1e1e]" />
                </div>
                <p className="text-[#6b6b6b] text-[13px] leading-[1.8]">
                  Upload a photo for AI to analyze your current hair and suggest styles. Or skip the photo for general recommendations based on your hair type.
                </p>
                <div className="mt-5">
                  <div className="text-[10px] tracking-[2px] uppercase text-[#6b6b6b] mb-2.5">
                    Photo (optional for personalized style suggestions)
                  </div>
                  <div
                    className="border border-dashed border-[#2a2a2a] rounded-[3px] p-8 text-center cursor-pointer transition-colors hover:border-[#c9a96e] bg-[#080808]"
                    onClick={() => fileRef.current?.click()}
                  >
                    {photo ? (
                      <img src={photo} className="w-full max-h-[280px] object-cover rounded-[2px]" alt="Your hair" />
                    ) : (
                      <>
                        <div className="text-[28px] mb-2.5">
                          <svg className="w-8 h-8 mx-auto text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-[#6b6b6b] text-[13px] tracking-[0.5px]">Tap to upload a photo of your hair</p>
                        <p className="text-[11px] mt-1.5 text-[#2a2a2a]">JPEG or PNG - AI will analyze and suggest styles</p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  {photo && (
                    <button
                      className="mt-2.5 bg-transparent border border-[#2a2a2a] text-[#6b6b6b] py-2.5 px-5 rounded-[2px] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all hover:border-[#c9a96e] hover:text-[#c9a96e]"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoB64(null);
                      }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
                <div className="mt-4 text-xs text-[#6b6b6b] tracking-[1px]">
                  Hair type: <span className="text-[#e8d5a3]">{p.hairType || "?"}</span> &middot; Concerns:{" "}
                  <span className="text-[#e8d5a3]">{p.hairConcerns.join(", ") || "None"}</span>
                </div>
                <div className="mt-6">
                  <button
                    className="bg-gradient-to-br from-[#c9a96e] to-[#a07840] text-[#080808] border-none py-4 px-8 text-[11px] tracking-[3px] uppercase font-semibold cursor-pointer rounded-[2px] transition-all inline-flex items-center gap-2.5 hover:translate-y-[-1px] hover:shadow-[0_8px_24px_rgba(201,169,110,0.2)] disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0"
                    onClick={() => generate("hair")}
                    disabled={loading.hair}
                  >
                    {loading.hair ? "Analyzing..." : photo ? "Analyze Photo + Generate Plan" : "Generate Hair Plan"}
                  </button>
                </div>
              </div>
              {loading.hair && (
                <div className="text-center py-12">
                  <div className="w-9 h-9 border border-[#2a2a2a] border-t-[#c9a96e] rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[11px] tracking-[2px] uppercase text-[#6b6b6b]">
                    {photo ? "Analyzing your hair..." : "Building your hair plan..."}
                  </p>
                </div>
              )}
              {errors.hair && (
                <div className="bg-[rgba(255,80,80,0.07)] border border-[rgba(255,80,80,0.2)] text-[#ff7070] py-3 px-4 rounded-[2px] text-[13px] mt-2.5">
                  {errors.hair}
                </div>
              )}
              {results.hair && (
                <ResultBox result={results.hair} onRegenerate={() => generate("hair")} />
              )}
            </div>
          )}

          {activeTab === "fragrance" && (
            <TabContent
              title="Fragrance Guide"
              description="Get perfume recommendations with exact names, prices, where to buy, and affordable dupes based on your vibe and budget."
              meta={
                <>
                  Scent vibes: <span className="text-[#e8d5a3]">{p.scentPrefs.join(", ") || "Not specified"}</span>
                </>
              }
              loading={loading.fragrance}
              error={errors.fragrance}
              result={results.fragrance}
              onGenerate={() => generate("fragrance")}
              loadingText="Finding your signature scent..."
            />
          )}

          {activeTab === "hygiene" && (
            <TabContent
              title="Hygiene & Grooming"
              description="A complete daily routine covering shower, oral care, body care, nails, laundry habits with a full product shopping list at your budget."
              loading={loading.hygiene}
              error={errors.hygiene}
              result={results.hygiene}
              onGenerate={() => generate("hygiene")}
              loadingText="Building your clean routine..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabContent({
  title,
  description,
  meta,
  loading,
  error,
  result,
  onGenerate,
  loadingText,
}: {
  title: string;
  description: string;
  meta?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  result?: string;
  onGenerate: () => void;
  loadingText: string;
}) {
  return (
    <div>
      <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8">
        <div className="text-[11px] tracking-[4px] uppercase text-[#c9a96e] mb-7 flex items-center gap-3 font-serif">
          {title}
          <span className="flex-1 h-px bg-[#1e1e1e]" />
        </div>
        <p className="text-[#6b6b6b] text-[13px] leading-[1.8]">{description}</p>
        {meta && <div className="mt-4 text-xs text-[#6b6b6b] tracking-[1px]">{meta}</div>}
        <div className="mt-6">
          <button
            className="bg-gradient-to-br from-[#c9a96e] to-[#a07840] text-[#080808] border-none py-4 px-8 text-[11px] tracking-[3px] uppercase font-semibold cursor-pointer rounded-[2px] transition-all inline-flex items-center gap-2.5 hover:translate-y-[-1px] hover:shadow-[0_8px_24px_rgba(201,169,110,0.2)] disabled:opacity-45 disabled:cursor-not-allowed disabled:translate-y-0"
            onClick={onGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : `Generate ${title}`}
          </button>
        </div>
      </div>
      {loading && (
        <div className="text-center py-12">
          <div className="w-9 h-9 border border-[#2a2a2a] border-t-[#c9a96e] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[11px] tracking-[2px] uppercase text-[#6b6b6b]">{loadingText}</p>
        </div>
      )}
      {error && (
        <div className="bg-[rgba(255,80,80,0.07)] border border-[rgba(255,80,80,0.2)] text-[#ff7070] py-3 px-4 rounded-[2px] text-[13px] mt-2.5">
          {error}
        </div>
      )}
      {result && <ResultBox result={result} onRegenerate={onGenerate} />}
    </div>
  );
}

function ResultBox({ result, onRegenerate }: { result: string; onRegenerate: () => void }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-[3px] p-8 mt-4 animate-fadeIn">
      <div
        className="result-content"
        dangerouslySetInnerHTML={{ __html: md(result) }}
      />
      <div className="flex justify-end mt-5">
        <button
          className="bg-transparent border border-[#2a2a2a] text-[#6b6b6b] py-2.5 px-5 rounded-[2px] text-[10px] tracking-[2px] uppercase cursor-pointer transition-all hover:border-[#c9a96e] hover:text-[#c9a96e]"
          onClick={onRegenerate}
        >
          Regenerate
        </button>
      </div>
      <style jsx>{`
        .result-content :global(h2) {
          font-family: var(--font-serif), serif;
          font-size: 26px;
          font-weight: 400;
          color: #c9a96e;
          margin: 28px 0 10px;
          letter-spacing: 1px;
        }
        .result-content :global(h3) {
          font-family: var(--font-serif), serif;
          font-size: 19px;
          font-weight: 400;
          color: #f5f0e8;
          margin: 20px 0 8px;
        }
        .result-content :global(p) {
          color: #aaa;
          font-size: 14px;
          line-height: 1.9;
          font-weight: 300;
          margin-bottom: 10px;
        }
        .result-content :global(ul),
        .result-content :global(ol) {
          color: #aaa;
          font-size: 14px;
          line-height: 1.9;
          font-weight: 300;
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .result-content :global(li) {
          margin-bottom: 5px;
        }
        .result-content :global(strong) {
          color: #e8d5a3;
          font-weight: 500;
        }
        .result-content :global(em) {
          color: #f5f0e8;
          font-style: italic;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}
