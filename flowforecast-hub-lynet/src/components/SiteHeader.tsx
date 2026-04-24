import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Layers, LogOut } from "lucide-react";

export function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground glow-low transition-transform group-hover:scale-105">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-glow-primary">Pulse Traffic</h1>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Nairobi · Live corridor intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-muted"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:bg-muted"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Hi, <span className="text-foreground">{user.name}</span>
              </span>
              <Button size="sm" variant="outline" onClick={signOut} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-1.5">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
