// This function is automatically triggered by Netlify when a form submission
// is received. It sends an email notification to archfossil@proton.me with
// the submission details.

export default async (req) => {
  try {
    const body = await req.json();
    const { payload } = body;

    // Only process submissions from the mail-campaign form
    if (payload?.form_name !== "mail-campaign") {
      return new Response("Ignored: not a mail-campaign submission", { status: 200 });
    }

    const { name, email, experience, message } = payload.data || {};

    console.log("New mail-in campaign enrollment received:");
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Experience: ${experience}`);
    console.log(`  Submitted at: ${payload.created_at}`);

    // The email notification is handled by Netlify's built-in form
    // notification system configured to send to archfossil@proton.me.
    // This function provides additional logging and processing capability.

    return new Response(
      JSON.stringify({
        message: "Submission processed successfully",
        form: payload.form_name,
        submitter: name,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return new Response("Error processing submission", { status: 500 });
  }
};
