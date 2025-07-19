const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <section className="w-full max-w-xl">{children}</section>
    </main>
  );
};

export default AuthLayout;
