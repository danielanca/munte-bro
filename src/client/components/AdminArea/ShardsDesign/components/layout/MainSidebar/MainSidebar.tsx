// components/AdminArea/layout/MainSidebar.tsx
import React from "react";
import classNames from "classnames";
import { Col } from "react-bootstrap";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";
import { Store } from "../../../flux";

type MainSidebarProps = {
  hideLogoText?: boolean;
};

type MainSidebarState = {
  menuVisible: boolean;
};

class MainSidebar extends React.Component<MainSidebarProps, MainSidebarState> {
  static defaultProps: Partial<MainSidebarProps> = { hideLogoText: false };

  constructor(props: MainSidebarProps) {
    super(props);
    this.state = { menuVisible: Store.getMenuState() };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ menuVisible: Store.getMenuState() });
  }

  render() {
    const classes = classNames("main-sidebar", "px-0", "col-12", this.state.menuVisible && "open");
    return (
      <Col as="aside" className={classes} lg={{ span: 2 }} md={{ span: 3 }}>
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarNavItems />
      </Col>
    );
  }
}

export default MainSidebar;
