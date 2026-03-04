import { resolveMx } from "node:dns/promises";

export default async (req) => {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return Response.json({ valid: false, reason: "Email is required." }, { status: 400 });
    }

    // Basic format check
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return Response.json({ valid: false, reason: "Invalid email format." });
    }

    const domain = email.split("@")[1];

    // Check MX records to verify the domain can receive email
    const mxRecords = await resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return Response.json({
        valid: false,
        reason: "This email domain does not appear to accept email.",
      });
    }

    return Response.json({ valid: true });
  } catch (error) {
    // DNS lookup failures (ENOTFOUND, ENODATA) mean the domain doesn't exist
    if (error.code === "ENOTFOUND" || error.code === "ENODATA" || error.code === "ESERVFAIL") {
      return Response.json({
        valid: false,
        reason: "This email domain does not exist or cannot receive email.",
      });
    }

    console.error("Email validation error:", error);
    // On unexpected errors, allow the submission through
    return Response.json({ valid: true });
  }
};

export const config = {
  path: "/.netlify/functions/validate-email",
};
