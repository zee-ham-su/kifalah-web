// Database rows hold real Date objects; the API contract (OpenAPI/Zod) says dates are strings.
// Passing rows straight into the response schema made every route that returned a row throw a
// ZodError (HTTP 500) even though the data was saved. Round-tripping through JSON turns Dates into
// ISO strings, which is exactly what the client receives anyway.
export const wire = (value: unknown): unknown => JSON.parse(JSON.stringify(value));
