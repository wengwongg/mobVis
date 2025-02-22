import {
  faChartSimple,
  faHospitalUser,
  faHouse,
  faRightFromBracket,
  faRightToBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "@/types/header";
import Link from "next/link";
import { getServerSession } from "next-auth";

// define preset set of navigation links
const visitorLinks: NavLink[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/login", label: "Login", icon: faRightToBracket },
];

const loggedInLinks: NavLink[] = [
  { href: "/population-insights", label: "Population Insights", icon: faUsers },
  { href: "/my-patients", label: "My Patients", icon: faHospitalUser },
  { href: "#", label: "Logout", icon: faRightFromBracket },
];

export default async function Header() {
  const session = await getServerSession();

  const navLinks = session ? loggedInLinks : visitorLinks;

  return (
    <header className="bg-background-dark py-4 px-6 m-3 rounded-lg flex items-center justify-between text-foreground-dark">
      <span className="flex gap-3">
        <FontAwesomeIcon icon={faChartSimple} size="2x" />
        <h1 className="text-3xl font-black">mobVis</h1>
      </span>
      <div className="flex gap-8">
        {navLinks.map((link) => (
          <div
            key={link.label}
            className="text-lg flex flex-row gap-3 items-center font-extrabold transition hover:text-[#D1D1D1]"
          >
            <Link href={link.href}>
              <FontAwesomeIcon icon={link.icon} className="" />
            </Link>
            <Link href={link.href}>
              <span className="">{link.label}</span>
            </Link>
          </div>
        ))}
        {session && <span className="text-md">{session.user?.email}</span>}
      </div>
    </header>
  );
}
