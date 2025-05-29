import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  ClipboardList,
  ListChecks,
  Users,
  DollarSign,
  UserCircle,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <NavigationMenu className="max-w-fit">
      <NavigationMenuList className="flex gap-6">
        <NavigationMenuItem>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <ClipboardList className="h-4 w-4" />
            Cotações
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/produtos"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <ClipboardList className="h-4 w-4" />
            Produtos
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/categorias"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <ListChecks className="h-4 w-4" />
            Categorias
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/representantes"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <Users className="h-4 w-4" />
            Representantes
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/caixa"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <DollarSign className="h-4 w-4" />
            Caixa
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/colaboradores"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <UserCircle className="h-4 w-4" />
            Colaboradores
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/clientes"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <HeartHandshake className="h-4 w-4" />
            Clientes
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/contas-pagar"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <DollarSign className="h-4 w-4" />
            Contas a Pagar
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/usuarios"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <UserCircle className="h-4 w-4" />
            Usuários
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
