import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Routes, Route } from "react-router-dom";
import ListaUsuarios from "./usuarios/ListaUsuarios";
import AdicionarUsuario from "./usuarios/AdicionarUsuario";
import EditarUsuario from "./usuarios/EditarUsuario";
import { sidebarItems } from "./usuarios/sidebarItems";

export default function UsuariosPage() {
  return (
    <div className="border-t">
      <div className="bg-background">
        <div className="grid lg:grid-cols-5">
          <Sidebar
            className="hidden lg:block"
            title="Usuários"
            items={sidebarItems}
          />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="inline-block">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <h1 className="text-2xl font-semibold">Usuários</h1>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <Routes>
                    <Route path="/" element={<ListaUsuarios />} />
                    <Route path="/adicionar" element={<AdicionarUsuario />} />
                    <Route path="/editar/:id" element={<EditarUsuario />} />
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
