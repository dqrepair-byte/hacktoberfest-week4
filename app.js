import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm@0.2.85";
import { SAFETY_RULES, findNotes, notesToText } from "./kb.js?v=8";

const $ = (id) => document.getElementById(id);
let engine = null;
let modelId = null;
const appliance = () => document.querySelector('input[name="appliance"]:checked')?.value || "washer";

$("safety").innerHTML = SAFETY_RULES.map((r) => `<li>${r}</li>`).join("");

if (!("gpu" in navigator)) {
  $("load-status").textContent =
    "This browser can't run the AI model (no WebGPU). The ghost will still answer from its field notes. For the full AI answer, try recent Chrome or Edge on a desktop.";
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
      },
      {
        // Read the prompt in small pieces. One big pass can run past the GPU driver's time
        // limit on integrated graphics, and the driver then resets and drops the model.
        prefill_chunk_size: 128,
        // Gemma 3's config ships both a context window and a sliding window, which WebLLM refuses.
        // Use a plain 2k context: enough for the notes and the answer, and light on video memory.
        ...(modelId.startsWith("gemma3") ? { context_window_size: 2048, sliding_window_size: -1 } : {}),
      }
    );
    $("load-status").textContent = "The tech has arrived. Everything from now on runs on your device.";
  } catch (err) {
    resetEngine(
      isLostModel(err)
        ? "Your graphics card couldn't hold this model. Pick Gemma 3 1B and try again, or close other tabs first. The ghost still answers from its field notes meanwhile."
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

// When the AI can't run on this computer, the ghost still answers straight from the field notes.
function notesAnswer(notes, why) {
  const box = $("answer");
  box.textContent = "";
  const p = document.createElement("p");
  p.className = "from-notes";
  p.textContent = why;
  box.append(p);
  const n = notes[0];
  box.append(
    `Most likely causes, most likely first:\n${n.causes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n` +
    `Checks you can do safely, simplest first:\n${n.checks.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n` +
    `When to call a living tech:\n${n.pro}\n\n` +
    `Unplug it or flip the breaker before you open any panel.`
  );
}

// Show the chosen machine above the answer, and make it rattle while the ghost is working.
function showAppliance(name, working) {
  $("answer-ap").querySelector("use").setAttribute("href", `#ap-${name}`);
  $("answer-ap").classList.toggle("working", working);
}

$("ask").addEventListener("submit", async (e) => {
  e.preventDefault();
  const machine = appliance();
  const symptom = $("symptom").value.trim();
  const brand = $("brand").value.trim();
  const code = $("code").value.trim();
  const notes = findNotes(machine, `${symptom} ${code}`, 2);
  $("notes").textContent = notesToText(notes);

  const details = [
    `Appliance: ${machine}`,
    brand && `Brand/model: ${brand}`,
    `Symptom: ${symptom}`,
    code && `Error code shown: ${code}`,
  ].filter(Boolean);
  const user = `${details.join("\n")}\n\nField notes:\n${notesToText(notes)}`;

  $("answer-box").hidden = false;
  $("answer-box").scrollIntoView({ behavior: "smooth", block: "start" });
  if (!engine) {
    showAppliance(machine, false);
    notesAnswer(notes, "gpu" in navigator
      ? "This one comes straight from the ghost's field notes. Summon the tech above for a fuller answer from the AI."
      : "This computer can't run the AI, so this comes straight from the ghost's field notes.");
    return;
  }
  $("answer").textContent = "";
  $("go").disabled = true;
  showAppliance(machine, true);
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
      notesAnswer(notes, "The ghost lost its grip: your graphics card dropped the AI model, which happens on some older or built-in GPUs. Here's what the field notes say instead.");
      resetEngine("Your graphics card dropped the model. Restart the browser and summon again to try the AI, or keep asking and the ghost answers from its field notes.");
      return;
    }
    $("answer").textContent = `Something went wrong: ${err.message || err}`;
  } finally {
    $("go").disabled = false;
    $("answer-ap").classList.remove("working");
  }
});
