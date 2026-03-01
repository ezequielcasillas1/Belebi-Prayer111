module.exports = function (api) {
  const runId = 'pre-fix-1';

  // #region agent log
  fetch('http://127.0.0.1:7300/ingest/57385e69-e00c-43a4-8874-7310b7792ce9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d1ade8'},body:JSON.stringify({sessionId:'d1ade8',runId,hypothesisId:'H1',location:'babel.config.js:2',message:'babel config loaded',data:{cwd:process.cwd(),configDir:__dirname},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  let presetResolution = { ok: false, path: null, error: null };
  try {
    presetResolution = { ok: true, path: require.resolve('babel-preset-expo'), error: null };
  } catch (error) {
    presetResolution = { ok: false, path: null, error: error?.message ?? 'unknown' };
  }

  // #region agent log
  fetch('http://127.0.0.1:7300/ingest/57385e69-e00c-43a4-8874-7310b7792ce9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d1ade8'},body:JSON.stringify({sessionId:'d1ade8',runId,hypothesisId:'H2',location:'babel.config.js:13',message:'preset resolution result',data:presetResolution,timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  api.cache(true);

  // #region agent log
  fetch('http://127.0.0.1:7300/ingest/57385e69-e00c-43a4-8874-7310b7792ce9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d1ade8'},body:JSON.stringify({sessionId:'d1ade8',runId,hypothesisId:'H3',location:'babel.config.js:19',message:'babel return config',data:{presetName:'babel-preset-expo',jsxImportSource:'nativewind'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
