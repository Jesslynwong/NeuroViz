/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-13 14:17:57
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-31 16:58:03
 * @FilePath: /dataVis/src/page/Layout/index.tsx
 */
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import logo from "../../assets/logo_pure.png";
import logoText from "../../assets/logo_text.png";
import background from "../../assets/background.png";
import styled from "styled-components";
import { departmentName, productName } from "../../config/configuration";
import { filterAnimation } from "../../components/styled.components";
import { GithubOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const items: Parameters<typeof Menu>[0]["items"] = [
    {
      key: 1,
      label: "Tools",
      onClick: () => navigate("/"),
    },
    {
      key: 2,
      label: "Report",
    },
    {
      key: 3,
      label: "About Us",
    },
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <StyledLogo />
        <StyledLogoText />
        <Menu
          mode="horizontal"
          selectable={false}
          items={items}
          style={{ marginLeft: "10px" }}
        />
        <a
          href="https://github.com/Jesslynwong/NeuroViz"
          style={{ marginLeft: "auto", color: "inherit" }}
        >
          <GithubOutlined style={{ cursor: "pointer", fontSize: "20px" }} />
        </a>
      </StyledHeader>
      <StyledContent>
        <Outlet />
      </StyledContent>
      <Footer style={{ textAlign: "center", background: "none" }}>
        {productName} ©{new Date().getFullYear()} Created by {departmentName}
      </Footer>
    </StyledLayout>
  );
}

const StyledLayout = styled(Layout)`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: 120% auto;
  background-color: transparent;
  min-height: 100vh;
`;

const StyledLogo = styled.img.attrs({ src: logo, alt: "logo" })`
  height: 36px;
  cursor: pointer;
  animation: ${filterAnimation} 3s ease-in-out 0s infinite;
`;

const StyledContent = styled(Content)``;

const StyledLogoText = styled.img.attrs({ src: logoText, alt: "NeuroViz" })`
  margin-left: 8px;
  height: 20px;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;
