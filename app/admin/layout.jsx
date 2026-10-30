export const metadata = {
  title: {
    default: "Admin",
    template: "%s · Sraddha Admin",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-brand-bg">{children}</div>;
}
