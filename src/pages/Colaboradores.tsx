import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Users, UserPlus } from "lucide-react";

export default function Colaboradores() {
  const { pathname } = useLocation();

  const sidebarNavItems = [
    {
      title: "Visão Geral",
      href: "/colaboradores",
      icon: Users,
    },
    {
      title: "Adicionar Colaborador",
      href: "/colaboradores/adicionar",
      icon: UserPlus,
    },
  ];

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <div className="relative overflow-hidden py-6 pr-6 lg:py-8">
          <div className="space-y-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Gerenciamento
              </h2>
              <div className="space-y-1">
                {sidebarNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start gap-2",
                      pathname === item.href && "bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex w-full flex-col overflow-hidden">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Colaboradores</h2>
            <p className="text-muted-foreground">
              Gerencie os colaboradores da farmácia
            </p>
          </div>
          <Separator />
          <Suspense fallback={<div>Carregando...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
