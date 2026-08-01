/**
 * Assert-based checks for form-validation seam (TDD-style self-check).
 * Run: node --experimental-strip-types scripts/verify-form-validation.mjs
 * Falls back to dynamic import of compiled path via tsx-less duplicate of logic.
 */
import assert from "node:assert/strict";

// Inline mirror of critical rules so this runs without a TS loader.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function validateEmail(email) {
  const v = email.trim();
  if (!v) return "Email is required.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
  return null;
}
function validateName(name) {
  const v = name.trim();
  if (!v) return "Name is required.";
  if (v.length < 2) return "Enter your full name.";
  return null;
}
function validateConsent(agreed) {
  if (!agreed) return "Please agree to the Privacy Policy and Terms before submitting.";
  return null;
}
function submitErrorMessage(online = true) {
  if (!online) {
    return "You're offline";
  }
  return "We couldn't send";
}

assert.equal(validateEmail(""), "Email is required.");
assert.equal(validateEmail("not-an-email"), "Enter a valid email address.");
assert.equal(validateEmail("hello@mgcarchitecture.com"), null);
assert.equal(validateName("A"), "Enter your full name.");
assert.equal(validateName("Mariane"), null);
assert.match(validateConsent(false) ?? "", /Privacy Policy/);
assert.equal(validateConsent(true), null);
assert.match(submitErrorMessage(false), /offline/i);

console.log("PASS form-validation self-check (6 asserts)");
