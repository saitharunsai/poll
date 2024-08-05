import {
  DropdownMenu as RadixDropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import sideImageAuth from "@/assets/sideImageAuth.png";
import { useNavigate } from "react-router-dom";

export function DropdownMenu() {
  const navigate = useNavigate();
  return (
    <RadixDropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <img
            src={sideImageAuth}
            width="36"
            height="36"
            className="rounded-full"
            alt="Avatar"
            style={{ aspectRatio: "36/36", objectFit: "cover" }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            //todo(sai tharun ) need to add api call
            localStorage.clear();
            navigate("/login");
          }}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </RadixDropdownMenu>
  );
}
