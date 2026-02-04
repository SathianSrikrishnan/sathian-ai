export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        html, body {
          background: #FFFDF7 !important;
          color: #5D4E37 !important;
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
        {children}
      </div>
    </>
  );
}
