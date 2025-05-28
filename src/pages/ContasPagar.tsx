import { DollarSign, List, PlusCircle, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ListaContasPagar from "./contasPagar/ListaContasPagar";
import AdicionarContaPagar from "./contasPagar/AdicionarContaPagar";
import DashboardContasPagar from "./contasPagar/DashboardContasPagar";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/contas-pagar",
    icon: <BarChart2 className="h-4 w-4" />,
  },
  {
    name: "Listar Contas",
    href: "/contas-pagar/lista",
    icon: <List className="h-4 w-4" />,
  },
  {
    name: "Nova Conta",
    href: "/contas-pagar/adicionar",
    icon: <PlusCircle className="h-4 w-4" />,
  },
];

export default function ContasPagar() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Contas a Pagar"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Contas a Pagar</h1>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Contas a Pagar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Routes>
                    <Route path="/" element={<DashboardContasPagar />} />
                    <Route path="/lista" element={<ListaContasPagar />} />
                    <Route
                      path="/adicionar"
                      element={<AdicionarContaPagar />}
                    />
                  </Routes>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
