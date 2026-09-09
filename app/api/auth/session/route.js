import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Session error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to check session",
      },
      { status: 500 }
    );
  }
}
