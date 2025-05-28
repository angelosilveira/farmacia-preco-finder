import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Categorias from "./pages/Categorias";
import Representantes from "./pages/Representantes";
import Caixa from "./pages/Caixa";
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
            {" "}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/produtos/*" element={<Produtos />} />
              <Route path="/categorias/*" element={<Categorias />} />
              <Route path="/representantes/*" element={<Representantes />} />
              <Route path="/caixa/*" element={<Caixa />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
