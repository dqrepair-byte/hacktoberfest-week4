// Field notes: common appliance symptoms, what usually causes them, and the safe
// checks a homeowner can do before paying for a service call.
// Each entry is matched against what the user types, and the best matches are
// handed to the model as grounding so it doesn't invent repairs.

export const SAFETY_RULES = [
  "Unplug the appliance (or switch off its breaker) before removing any panel or touching wiring.",
  "If you smell gas: do not touch switches, leave the house, and call the gas company from outside.",
  "Never bypass a door switch, thermal fuse, or other safety device to make an appliance run.",
  "Microwaves store a lethal charge in the high-voltage capacitor even when unplugged. Inside-the-cabinet microwave repair is for a pro.",
  "Shut off the water supply before disconnecting any water line.",
  "If you see scorch marks, melted plastic, or smell burning, stop using it and call a technician.",
];

export const KB = [
  // Washers
  { appliance: "washer", symptom: "won't drain", keywords: ["drain", "water left", "standing water", "won't drain", "wont drain", "full of water"],
    causes: ["Clogged drain pump filter (front loaders have a small access door low on the front)", "Kinked or clogged drain hose", "Failed drain pump (hums but no water moves)", "Lid switch or door lock not sensing closed"],
    checks: ["Put towels down and open the pump filter slowly; clear socks, coins and lint", "Pull the washer out and straighten the drain hose; make sure it isn't pushed more than about 8 inches into the standpipe", "Run a drain/spin cycle and listen: a hum with no water moving points at the pump"],
    pro: "Pump replacement is a moderate DIY job; call a pro if you're not comfortable working with the machine on its side." },
  { appliance: "washer", symptom: "won't spin", keywords: ["spin", "won't spin", "wont spin", "clothes soaking wet", "wet clothes"],
    causes: ["Load is unbalanced (one heavy item like a rug or comforter)", "Not draining fully, so the control won't spin", "Lid switch or door lock fault", "Worn drive belt or motor coupling (older top loaders)"],
    checks: ["Redistribute the load and run spin only", "Confirm the tub drains first; a washer won't spin with water in it", "Listen for the lid/door lock clicking when the cycle starts"],
    pro: "Motor, clutch, and transmission work usually needs a technician." },
  { appliance: "washer", symptom: "leaking", keywords: ["leak", "leaking", "water on floor", "puddle"],
    causes: ["Torn door boot gasket (front loader)", "Loose or cracked fill hose at the back", "Too much detergent or non-HE detergent causing suds overflow", "Drain hose not secured in the standpipe"],
    checks: ["Wipe the door gasket and look for tears or trapped items", "Check both fill hoses at the wall and at the machine for drips while filling", "Run an empty rinse with no detergent and watch where the water appears"],
    pro: "Tub seal or bearing leaks under the tub are a pro repair and often not worth it on an old machine." },
  { appliance: "washer", symptom: "shaking or loud banging", keywords: ["shake", "shaking", "banging", "walking", "loud", "vibrat"],
    causes: ["Unbalanced load", "Machine not level", "Shipping bolts still in (new front loader)", "Worn suspension springs or shock absorbers"],
    checks: ["Rebalance the load", "Put a level on top and adjust the front feet, then lock the nuts", "On a new machine, check the back for shipping bolts"],
    pro: "Worn shocks and springs are a reasonable DIY part swap; bearing noise (a roar during spin) is a pro call." },

  // Dryers
  { appliance: "dryer", symptom: "runs but no heat", keywords: ["no heat", "not heating", "cold", "runs but", "takes forever", "won't dry", "wont dry"],
    causes: ["Clogged dryer vent forcing the thermal fuse or high-limit to trip", "Blown thermal fuse", "Burned-out heating element (electric)", "Failed igniter or gas valve coils (gas)", "Only one leg of 240V power at the outlet (electric): drum turns but no heat"],
    checks: ["Clean the lint screen and the full vent run to the outside; feel for strong airflow at the outside flap", "Check the breaker: electric dryers use a double breaker and one side can trip", "On a gas dryer, watch the burner window for the igniter glow when it calls for heat"],
    pro: "Clean the vent before replacing a thermal fuse, or the new fuse will blow too. Gas valve work: call a pro." },
  { appliance: "dryer", symptom: "won't start", keywords: ["won't start", "wont start", "dead", "nothing happens", "no power", "won't turn on", "wont turn on"],
    causes: ["Tripped breaker or loose plug", "Door switch not engaging", "Blown thermal fuse (on many models it cuts the motor too)", "Broken drive belt tripping the belt switch"],
    checks: ["Check the breaker and the plug", "Press the door switch by hand and listen for a click", "Turn the drum by hand: if it spins very freely, the belt is likely broken"],
    pro: "Motor and control board faults are worth a diagnosis visit." },
  { appliance: "dryer", symptom: "squealing or thumping", keywords: ["squeal", "squeak", "thump", "grinding", "noisy"],
    causes: ["Worn drum rollers or idler pulley", "Worn drum glides or felt seal", "Something stuck in the blower wheel"],
    checks: ["Turn the drum by hand and listen for where the noise comes from", "Check pockets: coins and pens often end up in the blower"],
    pro: "Rollers and idler pulleys come in inexpensive kits; good DIY job with a video for your model." },

  // Refrigerators
  { appliance: "refrigerator", symptom: "not cooling", keywords: ["not cold", "not cooling", "warm", "fridge warm", "freezer works", "not cold enough"],
    causes: ["Dirty condenser coils (underneath or behind)", "Condenser fan not running", "Evaporator frosted over from a defrost problem (freezer cold, fridge warm)", "Blocked air vent between freezer and fridge", "Start relay or compressor fault"],
    checks: ["Vacuum the condenser coils and make sure the fan under the fridge spins when it's running", "Check the freezer back panel for heavy frost: that points at the defrost system", "Make sure food isn't blocking the vents inside", "Listen at the back: clicking every few minutes with no hum points at the start relay"],
    pro: "Sealed system problems (refrigerant leaks, compressor) are a pro repair, and on an older fridge often cost more than replacement." },
  { appliance: "refrigerator", symptom: "water leaking", keywords: ["leak", "water under", "water on floor", "puddle", "water inside"],
    causes: ["Clogged defrost drain (water pools under the crisper drawers)", "Cracked or loose ice maker water line", "Drain pan out of place"],
    checks: ["Look for ice in the bottom of the freezer; flush the defrost drain with warm water", "Pull the fridge out and check the water line connection while the ice maker fills"],
    pro: "Mostly DIY. Call a pro if the leak is from the water valve behind the back panel and you're not comfortable with it." },
  { appliance: "refrigerator", symptom: "ice maker not working", keywords: ["ice maker", "no ice", "ice"],
    causes: ["Ice maker switched off or the shutoff arm raised", "Water supply valve closed or line kinked", "Frozen fill tube", "Clogged water filter"],
    checks: ["Confirm the ice maker is on and the arm is down", "Check that the supply valve is open and the line isn't kinked", "Replace an old water filter"],
    pro: "Ice maker modules and inlet valves are usually plug-in parts; fine for DIY." },
  { appliance: "refrigerator", symptom: "clicking or loud buzzing", keywords: ["click", "buzz", "humming", "noise"],
    causes: ["Compressor start relay failing", "Condenser or evaporator fan hitting ice or debris"],
    checks: ["Listen for a click every few minutes with the compressor not starting", "Open the freezer: if the noise changes when the door opens, it's the evaporator fan"],
    pro: "A start relay is cheap and plugs onto the compressor, but unplug first." },

  // Dishwashers
  { appliance: "dishwasher", symptom: "not draining", keywords: ["drain", "water in bottom", "standing water", "won't drain", "wont drain"],
    causes: ["Clogged filter under the bottom rack", "Garbage disposal knockout plug not removed (new install)", "Kinked drain hose", "Failed drain pump"],
    checks: ["Pull and rinse the filter assembly", "Run the garbage disposal first, since the dishwasher drains into it", "Check the drain hose under the sink for kinks"],
    pro: "Drain pump replacement is moderate DIY." },
  { appliance: "dishwasher", symptom: "dishes not clean", keywords: ["dirty", "not clean", "film", "residue", "spots"],
    causes: ["Clogged filter or spray arm holes", "Water not hot enough", "Hard water with no rinse aid"],
    checks: ["Clean the filter and poke debris out of the spray arm holes", "Run the kitchen tap hot before starting a cycle", "Add rinse aid"],
    pro: "Rarely a pro issue unless the wash pump has failed." },

  // Ovens and ranges
  { appliance: "oven", symptom: "not heating", keywords: ["oven not heating", "won't heat", "wont heat", "not hot", "no heat", "won't bake", "wont bake"],
    causes: ["Burned-out bake element (electric, often visibly blistered)", "Weak igniter that glows but doesn't open the gas valve (gas)", "Failed temperature sensor", "Control lockout or clock not set after a power outage"],
    checks: ["Look at the bake element for breaks or blisters", "On gas: watch the igniter. If it glows for more than about 90 seconds without lighting, it's likely too weak", "Check that the clock is set and the oven isn't in lock mode"],
    pro: "Elements are a common DIY swap with the power off. Anything involving gas lines: call a pro." },
  { appliance: "oven", symptom: "burner won't light", keywords: ["burner", "won't light", "wont light", "clicking", "stovetop"],
    causes: ["Wet or dirty burner cap and igniter after a spill", "Burner cap not seated", "Spark module fault (clicks constantly)"],
    checks: ["Let a wet burner dry fully, clean the ports with a pin, and seat the cap", "If it smells of gas and won't light, turn it off and air the room"],
    pro: "Gas smell that doesn't clear: leave and call the gas company." },

  // Microwaves
  { appliance: "microwave", symptom: "runs but doesn't heat", keywords: ["not heating", "doesn't heat", "doesnt heat", "cold food", "runs but"],
    causes: ["Failed magnetron, diode, or high-voltage capacitor", "Door switch partly failed"],
    checks: ["Confirm with a cup of water for one minute", "This fault lives in the high-voltage section"],
    pro: "Do not open the cabinet. The capacitor can hold a lethal charge. Pro repair, or replace a countertop unit." },
];

// Simple keyword scoring: good enough for a few dozen entries and fully explainable.
export function findNotes(appliance, text, limit = 3) {
  const q = (text || "").toLowerCase();
  return KB
    .filter((e) => !appliance || e.appliance === appliance)
    .map((e) => ({ e, score: e.keywords.reduce((s, k) => s + (q.includes(k) ? k.length : 0), 0) }))
    .sort((a, b) => b.score - a.score)
    .filter((x, i) => x.score > 0 || i === 0)
    .slice(0, limit)
    .map((x) => x.e);
}

export function notesToText(notes) {
  return notes.map((n, i) =>
    `Note ${i + 1}: ${n.appliance} - ${n.symptom}\n` +
    `Likely causes: ${n.causes.join("; ")}\n` +
    `Safe checks: ${n.checks.join("; ")}\n` +
    `When to call a pro: ${n.pro}`
  ).join("\n\n");
}
