(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
    });
});
}),
"[project]/src/lib/supabase/storage.ts [app-client] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/src_lib_supabase_storage_ts_6ed75148._.js",
  "static/chunks/src_lib_supabase_storage_ts_81184914._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/supabase/storage.ts [app-client] (ecmascript)");
    });
});
}),
]);