/**
 * snapshot migration
 * 
 * ```bash
 * ./pb/pocketbase migrate collections
 * ```
 */
migrate((/* app */) => {
    // migrate up
    console.log(`initial snapshot created.`);
}, (/* app */) => {
    // migrate down
    console.log(`initial snapshot deleted.`);
}); 