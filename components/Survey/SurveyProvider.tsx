"use client";

import { Participation } from "@/types";
import { createContext, useContext, useState } from "react";

type imageUrls = {
  [id: number]: string;
};

type SurveyContextProps = {
  comparisons: number[][];
  setComparisons: (comparisons: number[][]) => void;
  imageUrls: imageUrls;
  participation: Participation;
  questionnaireFinished: boolean;
};

const SurveyContext = createContext({} as SurveyContextProps);

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({
  children,
  initialComparisons,
  imageUrls,
  participation,
  questionnaireFinished,
}: {
  children: React.ReactNode;
  initialComparisons: number[][];
  imageUrls: imageUrls;
  participation: Participation;
  questionnaireFinished: boolean;
}) => {
  const [comparisons, setComparisons] = useState(initialComparisons);

  return (
    <SurveyContext.Provider
      value={{
        comparisons,
        setComparisons,
        imageUrls,
        participation,
        questionnaireFinished,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};
