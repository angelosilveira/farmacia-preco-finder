import { ClipboardList, Grid, List, PlusCircle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/produtos",
    icon: <Grid className="h-4 w-4" />,
  },
  {
    name: "Lista de Produtos",
    href: "/produtos/lista",
    icon: <List className="h-4 w-4" />,
  },
  {
    name: "Cadastrar Produto",
    href: "/produtos/cadastrar",
    icon: <PlusCircle className="h-4 w-4" />,
  },
];

export default function Produtos() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Produtos"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Produtos</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Conteúdo do gerenciamento de produtos será implementado aqui */}
                  <p className="text-muted-foreground">
                    Esta funcionalidade será implementada em breve.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
