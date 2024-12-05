"use client";

import { PairwiseComparison } from "@/types";
import { createContext, useContext } from "react";

type imageUrls = {
  [id: number]: string;
};

type SurveyContextProps = {
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
};

const SurveyContext = createContext({} as SurveyContextProps);

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({
  children,
  comparisons,
  imageUrls,
}: {
  children: React.ReactNode;
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
}) => {
  return (
    <SurveyContext.Provider value={{ comparisons, imageUrls }}>
      {children}
    </SurveyContext.Provider>
  );
};
