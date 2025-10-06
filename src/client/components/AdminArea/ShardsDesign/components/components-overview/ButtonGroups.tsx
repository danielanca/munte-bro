// components/AdminArea/ButtonGroups.tsx
import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

export interface ButtonGroupsProps {
  className?: string;
}

const ButtonGroups: React.FC<ButtonGroupsProps> = ({ className }) => (
  <ButtonGroup className={className ?? "mb-3"}>
    <Button variant="primary">Fizz</Button>
    <Button variant="light">Buzz</Button>
    <Button variant="light">Foo</Button>
    <Button variant="light">Bar</Button>
  </ButtonGroup>
);

export default ButtonGroups;
