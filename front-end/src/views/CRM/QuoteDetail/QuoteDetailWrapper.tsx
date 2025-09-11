import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import QuoteDetail from "./QuoteDetail";

const QuoteDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loai = (searchParams.get("loai") as "baogia" | "hopdong") ?? "hopdong";


  return (
    <QuoteDetail
      loai={loai}
      onBack={() => navigate("/quotes")} // Back button goes to previous page
    />
  );
};

export default QuoteDetailWrapper;
