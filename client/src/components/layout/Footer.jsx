export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <p style={{ margin: 0, color: "rgba(245,245,247,0.75)" }}>
          © {new Date().getFullYear()} Coffee Shop • Built with React
        </p>
      </div>
    </footer>
  );
}
