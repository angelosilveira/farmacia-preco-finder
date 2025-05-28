import { ListChecks, Grid, List, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ListaCategorias from "./categorias/ListaCategorias";
import AdicionarCategoria from "./categorias/AdicionarCategoria";
import EditarCategoria from "./categorias/EditarCategoria";
import VisaoGeralCategorias from "./categorias/VisaoGeralCategorias";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/categorias",
    icon: <Grid className="h-4 w-4" />,
  },
  {
    name: "Lista de Categorias",
    href: "/categorias/lista",
    icon: <List className="h-4 w-4" />,
  },
  {
    name: "Adicionar Categoria",
    href: "/categorias/adicionar",
    icon: <PlusCircle className="h-4 w-4" />,
  },
];

export default function Categorias() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Categorias"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <ListChecks className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Categorias</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <Routes>
                    <Route path="/" element={<VisaoGeralCategorias />} />
                    <Route path="/lista" element={<ListaCategorias />} />
                    <Route path="/adicionar" element={<AdicionarCategoria />} />
                    <Route path="/editar/:id" element={<EditarCategoria />} />
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
