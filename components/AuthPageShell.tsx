import Link from "next/link";
import type { ReactNode } from "react";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  bottomText: string;
  bottomLinkHref: string;
  bottomLinkText: string;
}

export default function AuthPageShell({
  title,
  subtitle,
  children,
  bottomText,
  bottomLinkHref,
  bottomLinkText,
}: AuthPageShellProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card px-10 py-12 border border-default flex flex-col items-center">
          <div className="mb-10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-surface shadow-md overflow-hidden">
              <img
                src="/logo.png"
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="ml-3 text-2xl font-extrabold tracking-tight">
              Polar Desk
            </span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">{title}</h1>
            <p className="text-sm text-muted max-w-[240px] mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="w-full space-y-4">{children}</div>

          <div className="mt-10 w-8 h-1 rounded-full bg-[rgb(var(--primary)/0.2)]"></div>

          <div className="mt-8">
            <p className="text-sm text-muted font-medium">
              {bottomText}{" "}
              <Link
                href={bottomLinkHref}
                className="text-primary hover:underline"
                style={{ color: "rgb(var(--primary))" }}
              >
                {bottomLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: "rgb(var(--primary) / 0.05)" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{ background: "rgb(var(--primary) / 0.05)" }}
        ></div>
      </div>
    </main>
  );
}
