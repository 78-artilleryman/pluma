// Layout.tsx

import React from "react";
import Header from "../Header/Header";

interface LayoutProps {
  children: React.ReactNode; // 자식 컴포넌트를 받을 수 있는 props를 정의합니다.
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
