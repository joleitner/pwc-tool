"use client";

import { PairwiseComparison, Participation } from "@/types";
import { createContext, useContext, useState } from "react";

type imageUrls = {
  [id: number]: string;
};

type SurveyContextProps = {
  comparisons: PairwiseComparison[];
  setComparisons: (comparisons: PairwiseComparison[]) => void;
  imageUrls: imageUrls;
  participation: Participation;
};

const SurveyContext = createContext({} as SurveyContextProps);

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({
  children,
  initialComparisons,
  imageUrls,
  participation,
}: {
  children: React.ReactNode;
  initialComparisons: PairwiseComparison[];
  imageUrls: imageUrls;
  participation: Participation;
}) => {
  const [comparisons, setComparisons] =
    useState<PairwiseComparison[]>(initialComparisons);

  return (
    <SurveyContext.Provider
      value={{ comparisons, setComparisons, imageUrls, participation }}
    >
      {children}
    </SurveyContext.Provider>
  );
};
