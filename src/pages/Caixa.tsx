import { DollarSign, Grid, List, PlusCircle, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";
import FechamentoCaixa from "./caixa/FechamentoCaixa";
import HistoricoCaixa from "./caixa/HistoricoCaixa";
import VisaoGeralCaixa from "./caixa/VisaoGeralCaixa";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/caixa",
    icon: <Grid className="h-4 w-4" />,
  },
  {
    name: "Fechamento de Caixa",
    href: "/caixa/fechamento",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    name: "Histórico",
    href: "/caixa/historico",
    icon: <History className="h-4 w-4" />,
  },
];

export default function Caixa() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Caixa"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Caixa</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Caixa</CardTitle>
                </CardHeader>
                <CardContent>
                  <Routes>
                    <Route path="/" element={<VisaoGeralCaixa />} />
                    <Route path="/fechamento" element={<FechamentoCaixa />} />
                    <Route path="/historico" element={<HistoricoCaixa />} />
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
