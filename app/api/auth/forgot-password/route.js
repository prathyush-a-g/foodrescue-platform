import crypto from "crypto";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

const schema = z.object({ email: z.string().email() });
const safeMessage = "If an account exists for that email, password reset instructions will be sent shortly.";

export async function POST(request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ message: "Please enter a valid email address." }, { status: 400 });

  await connectToDatabase();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });
  if (!user) return Response.json({ success: true, message: safeMessage });

  // Store only a hash: the raw token belongs in a one-time email link.
  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  // Configure an email provider before deployment. Never include the raw token in API responses.
  console.info(`Password reset requested for user ${user._id}`);
  return Response.json({ success: true, message: safeMessage });
}
