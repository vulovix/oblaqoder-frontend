import "./Header.scss";
import { LogoQ } from "../LogoQ/Logo";

export interface Link {
  link: string;
  label: string;
  links: Array<Link>;
}

export function Header() {
  return (
    <header className={"header-wrapper"}>
      <div className={"inner"}>
        <LogoQ />
      </div>
    </header>
  );
}
