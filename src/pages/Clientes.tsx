import {
  HeartHandshake,
  PlusCircle,
  UploadCloud,
  UserCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ListaClientes from "./clientes/ListaClientes";
import AdicionarCliente from "./clientes/AdicionarCliente";
import ImportarClientes from "./clientes/ImportarClientes";

const sidebarItems = [
  {
    name: "Visão Geral",
    href: "/clientes",
    icon: <HeartHandshake className="h-4 w-4" />,
  },
  {
    name: "Adicionar Cliente",
    href: "/clientes/adicionar",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    name: "Importar Clientes",
    href: "/clientes/importar",
    icon: <UploadCloud className="h-4 w-4" />,
  },
  {
    name: "Usuários",
    href: "/usuarios",
    icon: <UserCircle className="h-4 w-4" />,
  },
  // Add more items as needed
];

export default function Clientes() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Clientes"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Clientes</h1>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Routes>
                    <Route path="/" element={<ListaClientes />} />
                    <Route path="/adicionar" element={<AdicionarCliente />} />
                    <Route path="/importar" element={<ImportarClientes />} />
                    {/* <Route path="/editar/:id" element={<EditarCliente />} />
                    <Route path="/cobrancas" element={<Cobrancas />} />
                    <Route path="/pagamentos" element={<Pagamentos />} /> */}
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
