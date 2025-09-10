import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ContractDetail from "./ContractDetail";

const ContractDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loai = (searchParams.get("loai") as "baogia" | "hopdong") ?? "hopdong";


  return (
    <ContractDetail
      loai={loai}
      onBack={() => navigate("/contracts")} // Back button goes to previous page
    />
  );
};

export default ContractDetailWrapper;
