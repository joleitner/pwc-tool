"use client";

import { PairwiseComparison } from "@/types";
import { createContext, useContext } from "react";

type imageUrls = {
  [id: number]: string;
};

type SurveyContextProps = {
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
  surveyId: number;
};

const SurveyContext = createContext({} as SurveyContextProps);

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({
  children,
  comparisons,
  imageUrls,
  surveyId,
}: {
  children: React.ReactNode;
  comparisons: PairwiseComparison[];
  imageUrls: imageUrls;
  surveyId: number;
}) => {
  return (
    <SurveyContext.Provider value={{ comparisons, imageUrls, surveyId }}>
      {children}
    </SurveyContext.Provider>
  );
};
