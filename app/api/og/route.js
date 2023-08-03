import { ImageResponse } from "@vercel/og";

export async function GET(request) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "#1e293b",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#fef3c7" }}>Name Checker✅</span>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );
}
