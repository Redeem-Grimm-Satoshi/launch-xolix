exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const email = payload?.email || payload?.data?.email;
  if (!email) return { statusCode: 200, body: "no email" };

  const from = process.env.RESEND_FROM || "Xolix.AI <onboarding@resend.dev>";
  const html = `
    <div style="font-family:Georgia,serif;max-width:480px;color:#0F1A12;">
      <h2 style="font-style:italic;font-weight:400;margin:0 0 12px;">You're on the list.</h2>
      <p style="line-height:1.55;">Thanks for signing up. We'll send the first dispatch when <em>XolixDB</em> ships — papers, post-mortems, and the code as we work.</p>
      <p style="color:#6B6A62;font-size:13px;margin-top:24px;">— Xolix.AI Research Labs</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "You're on the list — Xolix.AI",
      html,
    }),
  });

  if (!res.ok) {
    return { statusCode: 500, body: `Resend error: ${await res.text()}` };
  }
  return { statusCode: 200, body: "sent" };
};
