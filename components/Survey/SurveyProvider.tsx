"use client";

import { PairwiseComparison, Participation } from "@/types";
import { createContext, useContext } from "react";

type imageUrls = {
  [id: number]: string;
};

type SurveyContextProps = {
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
  participation: Participation;
};

const SurveyContext = createContext({} as SurveyContextProps);

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({
  children,
  comparisons,
  imageUrls,
  participation,
}: {
  children: React.ReactNode;
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
  participation: Participation;
}) => {
  return (
    <SurveyContext.Provider value={{ comparisons, imageUrls, participation }}>
      {children}
    </SurveyContext.Provider>
  );
};
