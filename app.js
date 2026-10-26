import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.85";
import { SAFETY_RULES, findNotes, notesToText } from "./kb.js";

const $ = (id) => document.getElementById(id);
let engine = null;

$("safety").innerHTML = SAFETY_RULES.map((r) => `<li>${r}</li>`).join("");

if (!("gpu" in navigator)) {
  $("load-status").textContent =
    "This browser doesn't support WebGPU, so the model can't run here. Try recent Chrome or Edge on a desktop.";
  $("load").disabled = true;
}

$("load").addEventListener("click", async () => {
  const modelId = $("model").value;
  $("load").disabled = true;
  $("model").disabled = true;
  document.querySelector(".progress").hidden = false;
  try {
    engine = await CreateWebWorkerMLCEngine(
      new Worker(new URL("./worker.js", import.meta.url), { type: "module" }),
      modelId,
      {
        initProgressCallback: (r) => {
          $("bar").style.width = `${Math.round(r.progress * 100)}%`;
          $("load-status").textContent = r.text;
        },
      }
    );
    $("load-status").textContent = "Ready. Everything from here runs on your device.";
    $("go").disabled = false;
  } catch (err) {
    $("load-status").textContent = `Couldn't load the model: ${err.message || err}`;
    $("load").disabled = false;
    $("model").disabled = false;
  }
});

const SYSTEM = `You are Fix-It Friend, a patient appliance repair technician with years of field experience, helping a homeowner.
Rules:
- Safety comes first. If anything suggests a gas smell, burning, sparking, or work inside a microwave cabinet, tell them to stop and call a pro or the gas company. Always say to unplug or shut off the breaker before opening panels.
- Never tell anyone to bypass a door switch, thermal fuse, or other safety device.
- Base your answer on the field notes provided. If the notes don't cover it, say what you'd check first and be honest about uncertainty. Do not invent part numbers.
- If an error code is given and you are not sure what it means for that brand, say to look it up in the owner's manual or the brand's support page instead of guessing.
Answer in this order, short and plain:
1. Most likely causes, most likely first.
2. Step-by-step checks they can do safely, simplest first.
3. When to stop and call a pro.`;

$("ask").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!engine) return;
  const appliance = $("appliance").value;
  const symptom = $("symptom").value.trim();
  const brand = $("brand").value.trim();
  const code = $("code").value.trim();
  const notes = findNotes(appliance, `${symptom} ${code}`);
  $("notes").textContent = notesToText(notes);

  const details = [
    `Appliance: ${appliance}`,
    brand && `Brand/model: ${brand}`,
    `Symptom: ${symptom}`,
    code && `Error code shown: ${code}`,
  ].filter(Boolean);
  const user = `${details.join("\n")}\n\nField notes:\n${notesToText(notes)}`;

  $("answer-box").hidden = false;
  $("answer").textContent = "";
  $("go").disabled = true;
  try {
    const stream = await engine.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 700,
      stream: true,
    });
    for await (const chunk of stream) {
      $("answer").textContent += chunk.choices[0]?.delta?.content || "";
    }
  } catch (err) {
    $("answer").textContent = `Something went wrong: ${err.message || err}`;
  } finally {
    $("go").disabled = false;
  }
});
