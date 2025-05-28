import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ClipboardList, ListChecks, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <NavigationMenu className="max-w-fit">
      {" "}
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
