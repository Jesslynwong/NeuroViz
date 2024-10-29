/*
 * @Author: Jesslynwong jesslynwjx@gmail.com
 * @Date: 2024-09-13 14:17:57
 * @LastEditors: Jesslynwong jesslynwjx@gmail.com
 * @LastEditTime: 2024-10-10 14:39:48
 * @FilePath: /dataVis/src/page/Layout/index.tsx
 */
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import logo from "../../assets/logo_pure.png";
import logoText from "../../assets/logo_text.png";
import styled from "styled-components";
import { departmentName, productName } from "../../config/configuration";
import { filterAnimation } from "../../components/styled.components";

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
    <Layout style={{ minHeight: "100vh" }}>
      <StyledHeader>
        <StyledLogo />
        <StyledLogoText />
        <Menu
          mode="horizontal"
          selectable={false}
          items={items}
          style={{ marginLeft: "10px" }}
        />
      </StyledHeader>
      <Content>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        {productName} ©{new Date().getFullYear()} Created by {departmentName}
      </Footer>
    </Layout>
  );
}

const StyledLogo = styled.img.attrs({ src: logo, alt: "logo" })`
  height: 36px;
  cursor: pointer;
  animation: ${filterAnimation} 3s ease-in-out 0s infinite;
`;

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
