# Ghost Tech

The friendly ghost of an old appliance repairman, haunting your browser.

Tell it what your washer, dryer, fridge, dishwasher, oven or microwave is doing, and it walks you through the likely causes, the safe checks you can do yourself, and the point where you should stop and call a pro. It runs on an open-weight model on your own device, so nothing you type leaves your computer.

Built for the DEV Hacktoberfest 2026 Open-Source AI Challenge, Week 4: Ghost in the Machine. The idea is to honor the past: old service-call know-how that's disappearing as repair turns into replace, kept alive in a machine anyone can run for free.

**Live demo:** https://dqrepair-byte.github.io/hacktoberfest-week4/

## How it works

- **Open-weight model, local inference.** [WebLLM](https://github.com/mlc-ai/web-llm) runs Google's Gemma 2 2B (default), Llama 3.2 3B or Qwen 2.5 1.5B on your GPU through WebGPU, inside a web worker. The model downloads once and is cached by the browser.
- **Field notes as grounding.** `kb.js` holds troubleshooting notes written from real appliance-repair experience: symptoms, likely causes, safe checks, and when to call a pro. The best matches for your symptom are handed to the model so it stays grounded instead of inventing repairs.
- **Safety rules baked in.** The prompt and the page both put safety first: unplug before opening panels, leave the house if you smell gas, never bypass safety devices, never open a microwave cabinet.

## Run it

Open the live demo (GitHub Pages) in desktop Chrome or Edge, or serve the folder locally:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Add field notes

Each entry in `kb.js` has an appliance, a symptom, keywords, causes, checks and a "call a pro" line. Pull requests with more appliances and symptoms are welcome.

## Disclaimer

General guidance only, not a substitute for a licensed technician.

## License

MIT
