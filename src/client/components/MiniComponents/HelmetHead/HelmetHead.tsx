import React from "react";
import { Helmet } from "react-helmet";

interface HelmetProps {
  title: string;
  description: string;
}

const HelmetHead = ({ title, description }: HelmetProps) => {
  return (
    <Helmet>
      <title>{`${title} - MontanAir.Ros`}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default HelmetHead;
