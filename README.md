# QVAC Two Truths and a Lie Presenter

Enter 3 statements about yourself (you decide which are true), get them formatted into a fun, reveal-ready "two truths and a lie" presentation — generated on-device. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32029

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

The app never judges or guesses which statement is the lie — the model only writes a playful intro line, and your three statements are inserted verbatim by app code, not rewritten by the model.

## License

MIT
