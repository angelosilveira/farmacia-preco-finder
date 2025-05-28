import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Categorias from "./pages/Categorias";
import Representantes from "./pages/Representantes";
import Caixa from "./pages/Caixa";
import Colaboradores from "./pages/Colaboradores";
import ListaColaboradores from "./pages/colaboradores/ListaColaboradores";
import AdicionarColaborador from "./pages/colaboradores/AdicionarColaborador";
import EditarColaborador from "./pages/colaboradores/EditarColaborador";
import Clientes from "./pages/Clientes";
import ListaClientes from "./pages/clientes/ListaClientes";
import AdicionarCliente from "./pages/clientes/AdicionarCliente";
import EditarCliente from "./pages/clientes/EditarCliente";
import Cobrancas from "./pages/clientes/Cobrancas";
import Pagamentos from "./pages/clientes/Pagamentos";
import ContasPagar from "./pages/ContasPagar";
import NotFound from "./pages/NotFound";
import { MainNav } from "./components/MainNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container flex h-16 items-center px-4">
              <MainNav />
            </div>
          </header>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/produtos/*" element={<Produtos />} />
              <Route path="/categorias/*" element={<Categorias />} />
              <Route path="/representantes/*" element={<Representantes />} />
              <Route path="/caixa/*" element={<Caixa />} />
              <Route path="/colaboradores" element={<Colaboradores />}>
                <Route index element={<ListaColaboradores />} />
                <Route path="adicionar" element={<AdicionarColaborador />} />
                <Route path="editar/:id" element={<EditarColaborador />} />
              </Route>
              <Route path="/clientes" element={<Clientes />}>
                <Route index element={<ListaClientes />} />
                <Route path="adicionar" element={<AdicionarCliente />} />
                <Route path="editar/:id" element={<EditarCliente />} />
                <Route path="cobrancas" element={<Cobrancas />} />
                <Route path="pagamentos" element={<Pagamentos />} />
              </Route>
              <Route path="/contas-pagar/*" element={<ContasPagar />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
