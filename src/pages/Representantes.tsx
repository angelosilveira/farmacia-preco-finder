import { Users, Grid, List, PlusCircle, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import ListaRepresentantes from "./representantes/ListaRepresentantes";
import AdicionarRepresentante from "./representantes/AdicionarRepresentante";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/representantes",
    icon: <Grid className="h-4 w-4" />,
  },
  {
    name: "Lista de Representantes",
    href: "/representantes/lista",
    icon: <List className="h-4 w-4" />,
  },
  {
    name: "Adicionar Representante",
    href: "/representantes/adicionar",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    name: "Contatos",
    href: "/representantes/contatos",
    icon: <PhoneCall className="h-4 w-4" />,
  },
];

export default function Representantes() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Representantes"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Representantes</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Representantes</CardTitle>
                </CardHeader>{" "}
                <CardContent>
                  <Routes>
                    <Route
                      path="/"
                      element={<div>Página inicial de Representantes</div>}
                    />
                    <Route path="/lista" element={<ListaRepresentantes />} />
                    <Route
                      path="/adicionar"
                      element={<AdicionarRepresentante />}
                    />
                    <Route
                      path="/contatos"
                      element={<div>Lista de Contatos</div>}
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
