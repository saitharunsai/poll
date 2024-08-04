import { Link } from "react-router-dom";
import { DropdownMenu } from "./DropdownMenu";

export function Header() {
  return (
    <header className="flex items-center h-16 px-4 border-b bg-card shadow-sm md:px-6">
      <nav className="flex items-center gap-6 text-lg font-medium md:gap-8">
        <Link
          to="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-xl"
        >
          <VoteIcon className="w-6 h-6" />
          <span>Poll Dashboard</span>
        </Link>
        <Link to="#" className="text-primary-foreground">
          Polls
        </Link>
        <Link to="#" className="text-muted-foreground">
          Create Poll
        </Link>
        <Link to="#" className="text-muted-foreground">
          Analytics
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu />
      </div>
    </header>
  );
}

function VoteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  );
}
