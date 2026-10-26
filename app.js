import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.85";
import { SAFETY_RULES, findNotes, notesToText } from "./kb.js";

const $ = (id) => document.getElementById(id);
let engine = null;
let modelId = null;

$("safety").innerHTML = SAFETY_RULES.map((r) => `<li>${r}</li>`).join("");

if (!("gpu" in navigator)) {
  $("load-status").textContent =
    "This browser doesn't support WebGPU, so the model can't run here. Try recent Chrome or Edge on a desktop.";
  $("load").disabled = true;
}

// The GPU can drop the model (out of video memory, driver reset). When that happens,
// throw the engine away and let the user summon it again instead of failing forever.
function isLostModel(err) {
  return /disposed|not loaded|device (was )?lost|GPUDevice|out of memory/i.test(String(err?.message || err));
}

function resetEngine(message) {
  try { engine?.unload?.(); } catch {}
  engine = null;
  $("go").disabled = true;
  $("load").disabled = false;
  $("model").disabled = false;
  $("bar").style.width = "0%";
  $("load-status").textContent = message;
}

$("load").addEventListener("click", async () => {
  modelId = $("model").value;
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
    $("load-status").textContent = "The tech is here. Everything from now on runs on your device.";
    $("go").disabled = false;
  } catch (err) {
    resetEngine(
      isLostModel(err)
        ? "Your GPU ran out of room for this model. Pick Gemma 3 1B and try again, or close other tabs first."
        : `Couldn't load the model: ${err.message || err}`
    );
  }
});

const SYSTEM = `You are Ghost Tech, the friendly ghost of an old appliance repairman who spent decades on service calls and still can't stop fixing things. You talk plainly and kindly, a little old-school, like a tech standing in someone's laundry room. One light spooky touch per answer at most; never let the character get in the way of the help.
Rules:
- Safety comes first. If anything suggests a gas smell, burning, sparking, or work inside a microwave cabinet, tell them to stop and call a pro or the gas company. Always say to unplug or shut off the breaker before opening panels.
- Never tell anyone to bypass a door switch, thermal fuse, or other safety device.
- Base your answer on the field notes provided. If the notes don't cover it, say what you'd check first and be honest about uncertainty. Do not invent part numbers.
- If an error code is given and you are not sure what it means for that brand, say to look it up in the owner's manual or the brand's support page instead of guessing.
- If it's an old machine that's worth saving, say so. Repair beats the landfill when it's safe and sensible.
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
      // Gemma's chat template has no system role, so fold the instructions into the first user turn.
      messages: modelId.startsWith("gemma")
        ? [{ role: "user", content: `${SYSTEM}\n\n${user}` }]
        : [{ role: "system", content: SYSTEM }, { role: "user", content: user }],
      temperature: 0.3,
      max_tokens: 500,
      stream: true,
    });
    for await (const chunk of stream) {
      $("answer").textContent += chunk.choices[0]?.delta?.content || "";
    }
  } catch (err) {
    if (isLostModel(err)) {
      $("answer").textContent =
        "The ghost lost its grip. Your GPU dropped the model, which usually means it ran short on video memory. Pick Gemma 3 1B (the lightest), press Load model again, and ask once more. It loads faster the second time.";
      resetEngine("The model was unloaded. Press Load model to keep going.");
      return;
    }
    $("answer").textContent = `Something went wrong: ${err.message || err}`;
  } finally {
    if (engine) $("go").disabled = false;
  }
});
