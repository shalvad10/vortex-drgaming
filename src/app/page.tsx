import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #202a5a, #050818)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Vortex Game Platform</h1>
      <Link
        href="/game"
        style={{
          padding: "10px 24px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        Go to Game
      </Link>
    </main>
  );
}
