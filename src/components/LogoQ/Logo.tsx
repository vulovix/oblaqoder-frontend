import { NavLink } from "react-router";
import { Group, Image, Stack, Text, Title } from "@mantine/core";
import "./style.scss";
import logo from "/icons/icon-64x64.png";

export function LogoQ() {
  return (
    <div className="logo-q">
      <NavLink to="/" className="link">
        <Title size="h2" className="logo">
          {/* OBLAQODER */}
          OBLA
          <img
            style={{
              position: "relative",
              top: "2px",
            }}
            width={22}
            height={22}
            src={logo}
          />
          ODER
        </Title>
      </NavLink>
    </div>
  );
}
