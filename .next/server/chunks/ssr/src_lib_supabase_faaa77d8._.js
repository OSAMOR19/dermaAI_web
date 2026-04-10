module.exports = [
"[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/src/lib/supabase/storage.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_lib_supabase_storage_ts_9481b0c8._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/supabase/storage.ts [app-ssr] (ecmascript)");
    });
});
}),
];