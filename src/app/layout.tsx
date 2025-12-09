import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#1f2128", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
